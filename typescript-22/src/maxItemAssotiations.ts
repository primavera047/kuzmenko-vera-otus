function buildHeaderTable(transations_list: string[][]): Record<string, number>{
    let headerTable: Record<string, number> = {};
    for (let transaction of transations_list) {        
        for (let element of transaction) {            
            if (headerTable[element] === undefined) {
                headerTable[element] = 0;
            }

            ++headerTable[element];
        }        
    }

    return headerTable;
}

interface ITreeNode {
    value: string;
    parrent: Object;
    childs: Object[];

    findChild: (value: string) => Object | undefined;
    addChild: (value: string) => Object;
    getFirstParrent: () => Object;
}

class TreeNode implements ITreeNode {
    public value: string;
    public parrent: TreeNode;
    public childs: TreeNode[];

    constructor(value: string, parrent: TreeNode) {
        this.value = value;        
        this.parrent = parrent;        
        this.childs = [];              
    }

    findChild(value: string): TreeNode | undefined {
        let child: TreeNode | undefined = this.childs.find((child) => child.value === value);

        return child;
    }

    addChild(value: string): TreeNode {
        let child: TreeNode = this.findChild(value);

        if (child === undefined) {
            child = new TreeNode(value, this);            
            this.childs.push(child);                        
        }        

        return child;
    }

    getFirstParrent(): TreeNode {
        let currentNode: TreeNode = this;
        
        while (currentNode.parrent.value !== null) {
            currentNode = currentNode.parrent;
        }

        return currentNode;
    }
}

interface IFPTreeModification {
    root: TreeNode;
    addedElements: Record<string, TreeNode>;
    families: Record<string, string[]>;

    addTransaction: (transaction: string[]) => void;
}

class FPTreeModification implements IFPTreeModification {
    public root: TreeNode;
    public addedElements: Record<string, TreeNode>;
    public families: Record<string, string[]>;

    constructor() {
        this.root = new TreeNode(null, null);        
        this.addedElements = {};
        this.families = {};
    }

    addTransaction(transaction: string[]): void {        
        const firstElement: string = transaction.shift();
        let mainParrent: string;
        let currentNode: TreeNode;

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
        
        for (let elem of transaction) {
            currentNode = currentNode.addChild(elem);
            this.addedElements[elem] = currentNode;
            this.families[mainParrent].push(elem);
        }
    }
}

function maxItemAssociation(history_array: string[][]): string[] {  
    let tree = new FPTreeModification();
    const headerTable: Record<string, number> = buildHeaderTable(history_array);

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

    let maxLen: number = 0;

    for (let mainParrent in tree.families) {
        if (tree.families[mainParrent].length > maxLen) {
            maxLen = tree.families[mainParrent].length;
        }
    }

    let result: string[][] = []

    for (let mainParrent in tree.families) {
        if (tree.families[mainParrent].length === maxLen) {
            let resultArr: string[] = tree.families[mainParrent];
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
