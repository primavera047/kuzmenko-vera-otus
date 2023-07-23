function getPath(element, prevSelector='') {    
    let currentSelector = element.tagName;

    if (['HTML', 'HEAD', 'TITLE', 'BODY'].find((element) => currentSelector === element)) {
        return `${currentSelector}`.toLowerCase();
    }

    if (element.id) {
        return `#${element.id}`.toLowerCase();
    }     

    if (element.className) {
        currentSelector = `${currentSelector}.${element.className.replace(" ", ".")}`
    }

    const parent = element.parentElement;        
    
    if (parent.children.length > 1) {           
        const elementIndex = Array.from(parent.children).findIndex((child) => child === element);

        currentSelector = `${currentSelector}:nth-child(${elementIndex+1})`;
    }

    return `${getPath(parent, currentSelector)} > ${currentSelector}`.toLowerCase();
}

module.exports = getPath;

