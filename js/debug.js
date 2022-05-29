class Debug {
    static loadAll() {
        [...document.querySelectorAll('#genassets > .genrow > .card')].map(m => document.querySelector('#gencontainer > .genrow').appendChild(m.cloneNode(true)));
    }
    static emailGenUnexpected(_count) {
        let langs = ['hu','en','kekw','asd'];
        let result = [];
        for(let a=0; a<_count; a++) {
            let lang = langs[Data.getRandomInt(0,langs.length)];
            result.push(Data.Emails.gen(lang));
        }
        return result;
    }
    static emailGenExpected(_count) {
        let langs = ['hu','en'];
        let result = [];
        for(let a=0; a<_count; a++) {
            let lang = langs[Data.getRandomInt(0,langs.length)];
            result.push(Data.Emails.gen(lang));
        }
        return result;
    }
    static emailGenExpectedLang(_count,_lang) {
        let result = [];
        for(let a=0; a<_count; a++) {
            result.push(Data.Emails.gen(_lang));
        }
        return result;
    }
    static nameGenUnexpected(_count) {
        let langs = ['hu','en','kekw','asd'];
        let hasFirsts = [true,false];
        let hasLasts = [true,false];
        let dividers = [' ','-','','?','/',':','_'];
        let result = [];
        for(let a=0; a<_count; a++) {
            let lang = langs[Data.getRandomInt(0,langs.length)];
            let hasFirst = hasFirsts[Data.getRandomInt(0,hasFirsts.length)];
            let hasLast = hasLasts[Data.getRandomInt(0,hasLasts.length)];
            let divider = dividers[Data.getRandomInt(0,dividers.length)];
            result.push(Data.Names.gen(lang,hasFirst,hasLast,divider));
        }
        return result;
    }
    static nameGenExpected(_count) {
        let langs = ['hu','en'];
        let hasFirsts = [true];
        let hasLasts = [true];
        let dividers = [' '];
        let result = [];
        for(let a=0; a<_count; a++) {
            let lang = langs[Data.getRandomInt(0,langs.length)];
            let hasFirst = hasFirsts[Data.getRandomInt(0,hasFirsts.length)];
            let hasLast = hasLasts[Data.getRandomInt(0,hasLasts.length)];
            let divider = dividers[Data.getRandomInt(0,dividers.length)];
            result.push(Data.Names.gen(lang,hasFirst,hasLast,divider));
        }
        return result;
    }
    static unitTestStringIncrement() {
        let cases = [ // [expected][input]
            ['a',''],
            ['aaaa','000'],
            ['ab0a','ab90'],
            ['a0ba','a0a0'],
            ['00ea','00d0'],
            ['acaa','ab00'],
            ['baaa','a000'],
            ['00eaaa','00d000'],
            ['abce','abcd'],
            ['baab','baaa'],
            ['qwe0qzyqwertz','qwe0qzyqwerty'],
            ['786904859604','786904859603'],
            ['g7rh68d043k','g7rh68d043j'],
        ];
        cases.forEach(testcase => {
            let result = Data.String.increment(Config.settings.stringPool,testcase[1]);
            console.log(`${result==testcase[0]?'PASSED':'FAILED'}  ->  expected: '${(testcase[0]+`'`).padEnd(15,' ')} got: '${(result+`'`).padEnd(15,' ')} input: '${testcase[1]}'`);
        });
    }
    static MultiIncrementString(times,s,shouldLog) {
        while(times--) {
            s = Data.String.increment(Config.settings.stringPool,s);
            if(shouldLog) {
                console.log(s);
            }
        }
        return s;
    }
}