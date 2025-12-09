function longestCommonPrefix(strs: string[]): string {
    let test = strs[0];
    let array:string[]  = []
    let bool:boolean = false;
    // if(strs.length ){
    //     return''
    // }
    if(strs.length===0){
        return strs[0]
    }
    for(let i = 0; i<strs.length; i++ ){
        if(test[0] === strs[i][0]){
          bool=true
        }else{
             return''}
       
    }
    // if(bool){
        for(let i= 0; i<strs.length; i++){
            if(test[1]===strs[i][1]){
                bool = true;
            }else{ return strs[0]}
        }
    // }
    for(let i =0; i<strs.length; i++){
        if(test[1]===strs[i][1]){

        } else { return test[0]}
    } 
    for(let i =0; i<strs.length; i++){
        if(test[2]===strs[i][2]){

        } else { return test[0]+test[1]}
    } 


    return strs[0]
    
};
const a  = longestCommonPrefix( ["ab", 'a'])
console.log(a)