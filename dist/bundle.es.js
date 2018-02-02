import { Logger, allowedColors, logSymbols } from 'bitwane';
import serialize from 'serialize-javascript';
import jsDiff from 'diff';
import indent from 'indent-string';

function indent$1(str, depth){
    if ( depth === void 0 ) depth = '';

    var sep = '';
    if(!depth) { return str; }
    if(typeof depth === 'number'){
        depth = parseInt(depth);
        for(var i=0; i<depth; i++){
            sep += ' ';
        }
    }else if(typeof depth === 'string'){
        sep = depth;
    }

    if(/\n/.test(str)){
        var parts = str.split(/\n/);
        return parts.map(function (s){
            return sep + s;
        }).join('\n');
    }else{
        return sep + str;
    }
}

var colors = (function (){
    var color = function (c){ return function (s){ return '$('+c+')'+s+'$()'; }; };
    return Object.keys(allowedColors)
    .reduce(function (c, key){
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
    var normal = typeof window === 'undefined'
    ? 'white' : 'black';

    return function (part){
        // green for additions, red for deletions
        // grey for common parts

        var color = part.added ? 'green' :
          part.removed ? 'red' : normal;
          return colors[color](part.value);
        //process.stderr.write(part.value[color]);
    };
}

function inlineDiff(){
    var colorize = createColors();
    return function diff(expected, actual, dent){
        if ( dent === void 0 ) dent = 0;

        var dif, lhs = expected, rhs = actual;
        if(typeof lhs === 'string'){
            dif = jsDiff.diffWords(lhs, rhs);
            return dent
            ? indent$1(dif.map(colorize).join(''), dent).split('\n')
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
            return (lhs + " != " + rhs);
        }

        return dent
        ? dif.map(colorize).map(function (s){ return indent$1(s, dent); })
        : dif.map(colorize);
    }
}

var TestLogger = (function (Logger$$1) {
    function TestLogger(ref){
        if ( ref === void 0 ) ref = {};
        var prefixes = ref.prefixes; if ( prefixes === void 0 ) prefixes = {};
        var each = ref.each; if ( each === void 0 ) each = null;
        var diff = ref.diff; if ( diff === void 0 ) diff = null;

        Logger$$1.call(this, {each: each});
        this.prefixes = ['ok', 'notok']
        .reduce(function (obj, key){
            obj[key] = prefixes[key] || '';
            return obj;
        }, {});
        this._diff = diff || inlineDiff();
    }

    if ( Logger$$1 ) TestLogger.__proto__ = Logger$$1;
    TestLogger.prototype = Object.create( Logger$$1 && Logger$$1.prototype );
    TestLogger.prototype.constructor = TestLogger;
    TestLogger.prototype.log = function log (input, format, dent){
        if ( format === void 0 ) format = {};
        if ( dent === void 0 ) dent = 0;

        return Logger$$1.prototype.log.call(this, indent(input, dent), format);
    };
    TestLogger.prototype.error = function error (input, format, dent){
        if ( format === void 0 ) format = {};
        if ( dent === void 0 ) dent = 0;

        return Logger$$1.prototype.error.call(this, indent(input, dent), format);
    };
    TestLogger.prototype.ok = function ok (input, format, dent){
        if ( format === void 0 ) format = {};
        if ( dent === void 0 ) dent = 0;

        return this.log(this.prefixes.ok + input, format, dent);
    };
    TestLogger.prototype.notok = function notok (input, format, dent){
        if ( format === void 0 ) format = {};
        if ( dent === void 0 ) dent = 0;

        return this.error(this.prefixes.notok + input, format, dent);
    };
    TestLogger.prototype.diff = function diff (expected, actual, dent){
        var this$1 = this;

        var lines = this._diff(expected, actual, dent);

        lines.map(function (line){
            Logger$$1.prototype.log.call(this$1, line);
            return line;
        });
    };

    return TestLogger;
}(Logger));

export { logSymbols as symbols, TestLogger };
//# sourceMappingURL=bundle.es.js.map
