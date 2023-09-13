function buildTree() {
    const jsonString = document.getElementById('input').value;
    let myTree = document.createElement('my-tree');

    myTree.struct = btoa(jsonString);
    
    document.getElementById('result').appendChild(myTree);
}