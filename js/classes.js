class Utils {
    static json = {
        replacer: function(match, pIndent, pKey, pVal, pEnd) {
           var key = '<span class=json-key>';
           var val = '<span class=json-value>';
           var str = '<span class=json-string>';
           var r = pIndent || '';
           if (pKey)
              r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
           if (pVal)
              r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
           return r + (pEnd || '');
        },
        prettyPrint: function(obj) {
           var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
           return JSON.stringify(obj, null, 3)
              .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
              .replace(/</g, '&lt;').replace(/>/g, '&gt;')
              .replace(jsonLine, Utils.json.replacer);
        }
    }
    static getVer() {
        return parseInt(document.getElementById('ver').innerText());
    }
    static saveFile (filename, content) {
        const blob = new Blob([content], {type: 'text'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.style.display = "none";
            elem.href = window.URL.createObjectURL(blob, { oneTimeOnly: true });
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();        
            document.body.removeChild(elem);
        }
    }
    static showTooltipModal(elemID) {
        console.log(document.querySelector(`#genassets > * > .card[gentype="${elemID}"] > #tooltip`));
        document.querySelector(`#tooltipContainer`).innerText = '';
        document.querySelector(`#tooltipContainer`).innerHTML = document.querySelector(`#genassets > * > .card[gentype="${elemID}"] > #tooltip`).innerHTML;
        let BTooltipModal = new bootstrap.Modal(document.getElementById('tooltipModal'), {});
        BTooltipModal.show();
    }
    static nextSibling(elem,times) {
        let elem2 = elem.nextElementSibling;
        for(let elemCount=0; elemCount<times-1; elemCount++) {
            elem2 = elem2 ? elem2.nextElementSibling : elem2;
        }
        return elem2;
    }
    static parentNode(elem,times) {
        let elem2 = elem.parentNode;
        for(let elemCount=0; elemCount<times-1; elemCount++) {
            elem2 = elem2.parentNode;
        }
        return elem2;
    }
    static swapNodes(node1,node2) {
        let clonedNode1 = node1.cloneNode(true);
        let clonedNode2 = node2.cloneNode(true);
        node1.parentNode.replaceChild(clonedNode1, node2);
        node2.parentNode.replaceChild(clonedNode2, node1);
    }
    static scrollToBottom() {
        window.scrollTo(0,document.body.scrollHeight);
    }
    static alertTimoutId = -1;
    static shouldRunAlert = true;
    static alert(alertContent) {
        if(Utils.shouldRunAlert) {
            Utils.shouldRunAlert = false;
            setTimeout(() => {
                Utils.shouldRunAlert=true; // protect from freeze caused by long/infinite setTimeout loops
            }, 50);
            document.getElementById('errorPopupContent').innerHTML = alertContent;
            let popupElem = document.getElementById('errorPopup');
            popupElem.style.display = 'block';
            clearTimeout(Utils.alertTimoutId);
            Utils.alertTimoutId = setTimeout(() => {
                document.getElementById('errorPopup').style.display = 'none';
            }, 4000);
        }
    }
    static getNumCompound(length,pool,type) {
        switch (type) {
            default: return [...Array(length)].map(m => pool[Data.getRandomInt(0,pool.length)]);
            // needs more types
        }
    }
}





// really bad config implementation, needs rewriting
class Config {
    static settings = {
        stringPool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    }
    static defaultSettings = {
        stringPool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    }
    static resetConfig() {
        Config.settings = JSON.parse(JSON.stringify(Config.defaultSettings));
        Config.refreshUI();
        Config.saveConfig();
    }
    static refreshUI() {
        document.getElementById('settingsStringPool').value = Config.settings.stringPool;
    }
    static setStringPool() {
        Config.settings.stringPool = document.getElementById('settingsStringPool').value;
        Config.saveConfig();
    }
    static resetStringPool() {
        Config.settings.stringPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        Config.refreshUI();
        Config.saveConfig();
    }
    static saveConfig() {
        localStorage.setItem('genConfig',JSON.stringify(Config.settings));
    }
    static loadConfig() {
        let storedConfig = JSON.parse(localStorage.getItem('genConfig'));
        Config.settings = storedConfig ? storedConfig : Config.defaultSettings;
    }
}






class Generator {
    static selectedRow = 1;
    static changeRow(index) {} // to be implemented
    static addItem(itemType) {
        Utils.scrollToBottom();
        let newElem = document.querySelector(`#genassets > * > .card[gentype="${itemType}"]`).cloneNode(true);
        if(newElem && newElem.hasChildNodes()) document.querySelector(`#gencontainer > .genrow:nth-child(${Generator.selectedRow})`).appendChild(newElem);
    }
    static moveUp(node) {
        let card = Utils.parentNode(node,3);
        card.parentNode.insertBefore(card,card.previousElementSibling);
        window.scrollBy(0,-70);
    }
    static moveDown(node) {
        let card = Utils.parentNode(node,3);
        if(Utils.nextSibling(card,1)) {
            card.parentNode.insertBefore(card,Utils.nextSibling(card,2));
        }
        else {
            card.parentNode.prepend(card);
        }
        window.scrollBy(0,70);
    }
    static removeItem(node) {
        Utils.parentNode(node,3).remove();
    }
    static printAddElemList(chunk = 4) {
        let _container = document.getElementById('addElemList');
        let _elems = [...document.querySelectorAll('#genassets > .genrow:nth-child(1) > .card')].map(m => {
            return {
                title: m.querySelector('#elemTitle').innerHTML,
                genType: m.getAttribute('gentype')
            }
        });
        for (let i = 0; i < _elems.length; i += chunk) {
            let tr = document.createElement('tr');
            _elems.slice(i, i + chunk).forEach((_elem) => {
                let td = document.createElement('td');
                td.innerHTML = `<a class="dropdown-item" href="javascript:;" onclick="Generator.addItem('${_elem.genType}')">${_elem.title}</a>`;
                tr.appendChild(td);
            });
            _container.appendChild(tr);
        }
    }
    static generators = {
        'string': function(elem) {
            let strVal = elem.querySelector('#string_Input').value+'';
            if(elem.querySelector('#string_IncrementType').value=='increment') {
                elem.querySelector('#string_Input').value = Data.String.increment(Config.settings.stringPool,strVal);
                //console.log(`increment:  strVal:${strVal}  strInput:${elem.querySelector('#string_Input').value}  increment:${Data.String.increment(Config.settings.stringPool,strVal)}`);
            }
            return strVal;
        },
        'num': function(elem) {
            let numVal = parseInt(elem.querySelector('#num_Input').value);
            switch(elem.querySelector('#num_IncrementType').value) {
                case 'increment': elem.querySelector('#num_Input').value = numVal+1; break;
                case 'decrement': elem.querySelector('#num_Input').value = numVal-1; break;
            }
            return numVal;
        },
        'hex': function(elem) {
            let numInputVal = parseInt(elem.querySelector('#hex_Input').value);
            switch(elem.querySelector('#hex_IncrementType').value) {
                case 'increment':
                    elem.querySelector('#hex_Input').value = numInputVal+1;
                    elem.querySelector('#hex_Output').value = (numInputVal+1).toString(16);
                    break;
                case 'decrement':
                    elem.querySelector('#hex_Input').value = numInputVal-1;
                    elem.querySelector('#hex_Output').value = (numInputVal-1).toString(16);
                    break;
            }
            return numInputVal.toString(16);
        },
        'rString': function(elem) {
            let sLength = parseInt(elem.querySelector('#rString_Length').value);
            let sType = elem.querySelector('#rString_Type').value;
            let sResult = '';
            if(sLength && sLength>0) {
                while(sLength--) {
                    switch(sType) {
                        case 'stringPool': sResult += Config.settings.stringPool[Data.getRandomInt(0,Config.settings.stringPool.length)]; break;
                        default: sResult += Data.Chars.gen(sType);
                    }
                }
            }
            return sResult;
        },
        'rChar': function(elem) {
            let charType = elem.querySelector('#rChar_Type').value;
            switch(charType) {
                case 'stringPool': return Config.settings.stringPool[Data.getRandomInt(0,Config.settings.stringPool.length)];
                default: return Data.Chars.gen(charType);
            }
        },
        'rNum': function(elem) {
            return BigInt(Data.getRandomInt(elem.querySelector('#rNum_MinValue').value,elem.querySelector('#rNum_MaxValue').value)).toString();
        },
        'rArrayItem': function(elem) {
            let _array;
            try {
                _array = JSON.parse(elem.querySelector('#rArrayItem_Input').value);
            } catch (error) {
                Utils.alert('<strong>Hibás JSON bevitel a <code>Random tomb elem</code>-nél.</strong><br>'+error);
            }
            if(!_array || _array.length<1) _array = [''];
            return _array[Data.getRandomInt(0,_array.length)];
        },
        'rName': function(elem) {
            return Data.Names.gen(
                elem.querySelector('#rName_Language').value,
                elem.querySelector('#rName_HasFirstName').checked,
                elem.querySelector('#rName_HasLastName').checked,
                elem.querySelector('#rName_Separator').value
            );
        },
        'rPhoneNum': function(elem) {
            return Data.PhoneNum.gen(elem.querySelector('#rPhoneNum_Country').value);
        },
        'rEmail': function(elem) {
            return Data.Emails.gen(elem.querySelector('#rEmail_Language').value);
        },
        'rDateTime': function(elem) {
            return Data.randomDate(new Date(elem.querySelector('#rDateTime_Start').value),new Date(elem.querySelector('#rDateTime_End').value)).toLocaleString(elem.querySelector('#rDateTime_Locale').value);
        },
        'rColor': function(elem) {
            switch(elem.querySelector('#rColor_Type').value) {
                case 'textHu': return Data.Colors.gen('hu');
                case 'textEn': return Data.Colors.gen('en');
                case 'hex': return Data.HEX.gen(6,'').padStart(6,'0');
                case 'rgb':
                    let _divider = elem.querySelector('#rColor_Separator').value;
                    return [Data.getRandomInt(0,256),Data.getRandomInt(0,256),Data.getRandomInt(0,256)].join(_divider ? _divider : ',');
                default: return Data.Colors.gen('en');
            }
        },
        'rCountryCapital': function(elem) {
            return Data.CountriesCapitals.gen(
                elem.querySelector('#rCountryCapital_Language').value,
                elem.querySelector('#rCountryCapital_Country').checked,
                elem.querySelector('#rCountryCapital_Capital').checked,
                elem.querySelector('#rAddress_Separator').value,
            );
        },
        'rAddress': function(elem) {
            return Data.Telepulesek.gen(
                elem.querySelector('#rAddress_Orszag').checked,
                elem.querySelector('#rAddress_Megye').checked,
                elem.querySelector('#rAddress_Irsz').checked,
                elem.querySelector('#rAddress_Nev').checked,
                elem.querySelector('#rAddress_Utca').checked,
                elem.querySelector('#rAddress_Hazsz').checked,
                false,
                false,
                false,
                elem.querySelector('#rAddress_Separator').value
            );
        },
        'rIp': function(elem) {
            return Data.IP.gen(elem.querySelector('#rIp_Type').value,elem.querySelector('#rIp_Compress').checked)
        },
        'rMac': function(elem) {
            return Data.Mac.gen(elem.querySelector('#rMac_Separator').value);
        },
        'rInstitiute': function(elem) {
            return Data.Institutes.gen(
                elem.querySelector('#rInstitiute_Name').checked,
                elem.querySelector('#rInstitiute_FullName').checked,
                elem.querySelector('#rInstitiute_Code').checked,
                elem.querySelector('#rInstitiute_NormalizedName').checked,
                elem.querySelector('#rInstitiute_Separator').value
            );
        },
        'rLicensePlate': function(elem) {
            return Data.LicensePlate.gen(elem.querySelector('#rLicensePlate_Separator').value);
        },
        'rCar': function(elem) {
            return Data.Cars.gen(
                elem.querySelector('#rCar_Name').checked,
                elem.querySelector('#rCar_FuelC').checked,
                elem.querySelector('#rCar_Cylinders').checked,
                elem.querySelector('#rCar_Displacement').checked,
                elem.querySelector('#rCar_Horsepower').checked,
                elem.querySelector('#rCar_Weight').checked,
                elem.querySelector('#rCar_Accel').checked,
                elem.querySelector('#rCar_Year').checked,
                elem.querySelector('#rCar_Origin').checked,
                elem.querySelector('#rCar_Separator').value,
            );
        },
    }
    static gen() {
        let separator = document.getElementById('elemSeparator').value;
        let result = Utils.getNumCompound(parseInt(document.getElementById('rowCount').value) || 100, [1],'random').map(rowIndex =>
            [...document.querySelectorAll(`#gencontainer > .genrow:nth-child(${rowIndex}) > .card`)].map(card => Generator.generators[card.getAttribute('gentype')](card)).join(separator)
        ).join('\n');
        Utils.saveFile(`${document.querySelector('#fileName').value}.${document.querySelector('#fileExt').value}`,result);
    }
}