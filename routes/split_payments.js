import express from 'express';

const router = express.Router();

/*router.get('/', (req, res) => {
    console.log('WELCOME AGAIN!');

    
});*/

router.post('/compute', (req, res) => {
    
    try {
        
        const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body
        
        if (SplitInfo.length > 20 || SplitInfo.length < 1) {
            return res.status(400).json({message: " There is an error! You can only input a maximum of 20 values for the split info and a minimum of 1 value "})
            }

        const order = (items) => {
            const arrange = [{type:"FLAT", num:1}, {type:"PERCENTAGE", num: 2}, {type:"RATIO", num: 3}]
            for (let i = 0; i < items.length; i++){
                if(items[i].SplitType == arrange[0].type){
                    items[i].num = arrange[0].num
                }
                if(items[i].SplitType === arrange[1].type){
                    items[i].num = arrange[1].num
                  }
                if(items[i].SplitType === arrange[2].type){
                items[i].num = arrange[2].num
    
            }
        }

         items.sort((a,b) => a.num - b.num)  
         return {items}
    }
    sortarr = order(SplitInfo);

    const{items} = sortarr;

    
    SplitInfo.forEach(myFunction => {
        
    
        
        if (myFunction.SplitType === "FLAT"){
        Balance = Balance - SplitValue
        SplitBreakdown.push ({SplitEntityId, Amount: SplitValue});
        if ( SplitValue <0 || SplitValue > Amount ) {
            return res.status(400).json({message: "There is an issue with the split amount value, please check!"})
        };
        }
    });
    SplitInfo.forEach(myFunction => {
        
    
        if (myFunction.SplitType === "PERCENTAGE") {
            let split_amount = (myFunction.SplitValue/100) * Balance;
            Balance = Balance - split_amount;
            SplitBreakdown.push ({SplitEntityId, Amount: split_amount})
            if ( split_amount <0 || split_amount > Amount) {
                return res.status(400).json({message: "There is an issue with the split amount value, please check!"})
            }
        }
    });
 
    res.status(200).json({
        ID,
        Balance: Balance,
        SplitBreakdown
        });
        
    }
    
     catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;