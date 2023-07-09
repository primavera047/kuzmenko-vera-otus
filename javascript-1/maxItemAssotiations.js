function buildHeaderTable(transations_list) {
    let headerTable = {};
    for (const transaction of transations_list) {        
        for (const element of transaction) {            
            if (headerTable[element] === undefined) {
                headerTable[element] = 0;
            }

            ++headerTable[element];
        }        
    }

    return headerTable;
}

class TreeNode {
    constructor(value, parrent, mainParrent) {
        this.value = value;        
        this.parrent = parrent;        
        this.childs = [];              
    }

    findChild(value) {
        return this.childs.find((child) => child.value === value);
    }

    addChild(value) {
        let child = this.findChild(value);

        if (child === undefined) {
            child = new TreeNode(value, this);            
            this.childs.push(child);                        
        }        

        return child;
    }

    getFirstParrent() {
        let currentNode = this;
        
        while (currentNode.parrent.value !== null) {
            currentNode = currentNode.parrent;
        }

        return currentNode;
    }
}

class FPTreeModification {
    constructor() {
        this.root = new TreeNode(null, null);        
        this.addedElements = {};
        this.families = {};
    }

    addTransaction(transaction) {        
        const firstElement = transaction.shift();
        let mainParrent;
        let currentNode;

        if (firstElement in this.addedElements) {
            currentNode = this.addedElements[firstElement];
            mainParrent = currentNode.getFirstParrent().value;            
        }
        else {
            currentNode = this.root.addChild(firstElement);
            this.addedElements[firstElement] = currentNode;
            mainParrent = currentNode.value;
        }

        if (!(mainParrent in this.families)) {
            this.families[mainParrent] = [];
        }
        
        for (const elem of transaction) {
            currentNode = currentNode.addChild(elem);
            this.addedElements[elem] = currentNode;
            this.families[mainParrent].push(elem);
        }
    }
}

function maxItemAssociation(history_array) {  
    let tree = new FPTreeModification();
    headerTable = buildHeaderTable(history_array);

    for (let arr of history_array) {                
        arr.sort((a,b) => { 
            if (headerTable[a] === headerTable[b]) { 
                return a.localeCompare(b); 
            } 
            else { 
                if (headerTable[a] > headerTable[b]) {
                    return -1;
                }
                else if (headerTable[a] < headerTable[b]) {
                    return 1;                    
                }
                else {
                    return 0;
                }
            } 
        });        
        tree.addTransaction(arr);
    }

    let maxLen = 0;

    for (let mainParrent in tree.families) {
        if (tree.families[mainParrent].length > maxLen) {
            maxLen = tree.families[mainParrent].length;
        }
    }

    result = []

    for (let mainParrent in tree.families) {
        if (tree.families[mainParrent].length === maxLen) {
            resultArr = tree.families[mainParrent];
            resultArr.push(mainParrent);
            resultArr.sort();
            result.push(resultArr);
        }
    }

    if (result.length === 1) {
        return result[0];
    }
    else {
        result.sort((a, b) => { return a.toString().replace(",", "").localeCompare(b.toString().replace(",", "")); });
        return result[0];
    }
}


console.log(maxItemAssociation([['a', 'b'], ['a', 'c'], ['d', 'e']]));
console.log(maxItemAssociation([['w', 'q', 'a'], ['a', 'b'], ['a', 'c'], ['q', 'e'], ['q', 'r']]));
console.log(maxItemAssociation([['a', 'b'], ['a', 'c'], ['d', 'e', 'f']]));
