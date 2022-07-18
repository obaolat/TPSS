import express from "express";
import { validate } from "uuid";

const router = express.Router();

/*router.get('/', (req, res) => {
    console.log('WELCOME AGAIN!');

    
});*/



router.post("/compute", (req, res) => {
    try {
        const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

        let Balance = Amount
        let SplitBreakdown = []
        let BalanceAtRatio = 0

        if (SplitInfo.length > 20 || SplitInfo.length < 1) {
            return res
                .status(400)
                .json({
                    message:
                        " There is an error! You can only input a maximum of 20 values for the split info and a minimum of 1 value ",
                });
        }

        const order = (items) => {
            const arrange = [
                { type: "FLAT", num: 1 },
                { type: "PERCENTAGE", num: 2 },
                { type: "RATIO", num: 3 },
            ];
            for (let i = 0; i < items.length; i++) {
                if (items[i].SplitType == arrange[0].type) {
                    items[i].num = arrange[0].num;
                }
                if (items[i].SplitType === arrange[1].type) {
                    items[i].num = arrange[1].num;
                }
                if (items[i].SplitType === arrange[2].type) {
                    items[i].num = arrange[2].num;
                }
            }

            items.sort((a, b) => a.num - b.num);
            return items;
        };
        
        const sortedSplitInfo = order(SplitInfo);

        sortedSplitInfo.forEach(({SplitType, SplitValue, SplitEntityId}) => {
            if (SplitType === "FLAT") {
                Balance = Balance - SplitValue;
                SplitBreakdown.push({ SplitEntityId, Amount: SplitValue });
                amountValidation(SplitValue, Amount)
            }
        });
        sortedSplitInfo.forEach(({SplitType, SplitValue, SplitEntityId}) => {
            if (SplitType === "PERCENTAGE") {
                let split_amount = (SplitValue / 100) * Balance;
                Balance = Balance - split_amount;
                SplitBreakdown.push({ SplitEntityId, Amount: split_amount });
                amountValidation(split_amount, Amount)
            }
        });

        const ratioTypes = sortedSplitInfo.filter(split => {
            return split.SplitType === "RATIO"
        })

        const totalRatio = ratioTypes.reduce((prev, item) => prev + item.SplitValue, 0)


        for (let i=0; i < ratioTypes.length; i++) {
            if (i === 0) {
                BalanceAtRatio = Balance
            }
            const {SplitEntityId, SplitValue} = ratioTypes[i]
            const split_amount = ((SplitValue/totalRatio) * BalanceAtRatio)
            Balance = Balance - split_amount
            SplitBreakdown.push({ SplitEntityId, Amount: split_amount })
            amountValidation(split_amount, Amount)

        }

        const totalTransactionSum = SplitBreakdown.reduce(prev, next => prev + next.Amount, 0)

        if (totalTransactionSum > Amount) {
            return res
            .status(400)
            .json({ message: "There sum of the transaction is greater than the intial transaction amount" });
        }

        res.status(200).json({
            ID,
            Balance,
            SplitBreakdown,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

function amountValidation(value, amount) {
    if (value < 0 || value > amount) {
        return res
            .status(400)
            .json({ message: "There is an issue with the split amount value, please check!" });
    }
}

export default router;
