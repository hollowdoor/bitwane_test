import { Logger, logSymbols } from 'bitwane';
import { inlineDiff } from './lib/differs.js';
import indentString from 'indent-string';

export { logSymbols as symbols };

export class TestLogger extends Logger {
    constructor({
        prefixes = {},
        each = null,
        diff = null,
        indent = 0
    } = {}){
        super({each});
        this.prefixes = ['ok', 'notok']
        .reduce((obj, key)=>{
            obj[key] = prefixes[key] || '';
            return obj;
        }, {});
        this._diff = diff || inlineDiff();
        this._indent = indent || indentString;
    }
    log(input, format = {}, dent = 0){
        return super.log(this._indent(input, dent), format);
    }
    error(input, format = {}, dent = 0){
        return super.error(this._indent(input, dent), format);
    }
    ok(input, format = {}, dent = 0){
        return this.log(this.prefixes.ok + input, format, dent);
    }
    notok(input, format = {}, dent = 0){
        return this.error(this.prefixes.notok + input, format, dent);
    }
    diff(expected, actual, dent){
        let lines = this._diff(expected, actual, dent);

        lines.map(line=>{
            super.log(line);
            return line;
        });
    }
}

/*const log = TestLogger.prototype.log;
TestLogger.prototype._diffLog = IN_BROWSER
? function(lines){
    //let lines = diff(expected, actual, dent);
    return log.call(this, lines.join('\n\n'));
}
:
TestLogger.prototype._diffLog = function(lines){
    lines.map(line=>{
        log.call(this, line);
        return line;
    });
};*/
