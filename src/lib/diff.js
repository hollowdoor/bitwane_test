import indent from 'indent-string';
import serialize from 'serialize-javascript';
import jsDiff from 'diff';

const colors = (()=>{
    const color = c=> s=>'$('+c+')'+s+'$()';

    return {
        red: color('red'),
        green: color('green'),
        white: color('white'),
        black: color('black')
    };
})();

const normal = typeof window === 'undefined'
? 'white' : 'black';

function colorize(part){
    // green for additions, red for deletions
    // grey for common parts

    let color = part.added ? 'green' :
      part.removed ? 'red' : normal;
      return colors[color](part.value);
    //process.stderr.write(part.value[color]);
}

export function diff(expected, actual, dent = 0){
    let dif, lhs = expected, rhs = actual;
    if(typeof lhs === 'string'){
        dif = jsDiff.diffWords(lhs, rhs);
        return dent
        ? indent(dif.map(colorize).join(''), dent).split('\n')
        : dif.map(colorize).join('').split('\n');
    }else if(typeof lhs === 'object'){
        try{
            /*dif = jsDiff.diffWords(JSON.stringify(lhs, null, 2), JSON.stringify(rhs, null, 2),
            {
                //ignoreWhitespace: true
            });*/
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

    /*return dent
    ? indent(dif.map(colorize).join(''), dent).split('\n')
    : dif.map(colorize).join('').split('\n');*/
}
