export default function indent(str, depth = ''){
    let sep = '';
    if(!depth) return str;
    if(typeof depth === 'number'){
        depth = parseInt(depth);
        for(let i=0; i<depth; i++){
            sep += ' ';
        }
    }else if(typeof depth === 'string'){
        sep = depth;
    }

    if(/\n/.test(str)){
        const parts = str.split(/\n/);
        return parts.map(s=>{
            return sep + s;
        }).join('\n');
    }else{
        return sep + str;
    }
}
