import indent from '../indent.js';
import serialize from 'serialize-javascript';
import jsDiff from 'diff';
import { allowedColors } from 'bitwane';

const colors = (()=>{
    const color = c=> s=>'$('+c+')'+s+'$()';
    return Object.keys(allowedColors)
    .reduce((c, key)=>{
        c[key] = color(key);
        return c;
    }, {});
    /*return {
        red: color('red'),
        green: color('green'),
        white: color('white'),
        black: color('black')
    };*/
})();

function createColors(){
    const normal = typeof window === 'undefined'
    ? 'white' : 'black';

    return (part)=>{
        // green for additions, red for deletions
        // grey for common parts

        let color = part.added ? 'green' :
          part.removed ? 'red' : normal;
          return colors[color](part.value);
        //process.stderr.write(part.value[color]);
    };
}

export function inlineDiff(){
    const colorize = createColors();
    return function diff(expected, actual, dent = 0){
        let dif, lhs = expected, rhs = actual;
        if(typeof lhs === 'string'){
            dif = jsDiff.diffWords(lhs, rhs);
            return dent
            ? indent(dif.map(colorize).join(''), dent).split('\n')
            : dif.map(colorize).join('').split('\n');
        }else if(typeof lhs === 'object'){
            try{
                dif = jsDiff.diffJson(lhs, rhs, {
                    //newlineIsToken: true
                });
            }catch(e){
                dif = jsDiff.diffLines(
                    serialize(lhs),
                    serialize(rhs)
                );
            }
        }else{
            return `${lhs} != ${rhs}`;
        }

        return dent
        ? dif.map(colorize).map(s=>indent(s, dent))
        : dif.map(colorize);
    }
}
