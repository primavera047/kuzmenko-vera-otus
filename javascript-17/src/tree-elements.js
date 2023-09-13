import { LitElement, css, html } from 'lit'

export class MyTree extends LitElement {
    static get properties() {
        return {
            struct: { type: String },
        }
    }

    render() {
        console.log(this.struct);
        const jsonStruct = JSON.parse(atob(this.struct));  

        let htmlBlock = [];        

        if (jsonStruct.items !== undefined) {           
            htmlBlock.push(html`<li>${jsonStruct.id}</li>`);
      
            for (let node of jsonStruct.items) {               
                htmlBlock.push(html`<my-tree struct='${btoa(JSON.stringify(node))}'></my-tree>`);
            }
        }
        else {
            htmlBlock.push(html`<my-leaf struct='${btoa(JSON.stringify(jsonStruct))}'></my-leaf>`);
        }

        return html`<ul>${htmlBlock}</ul>`;
    }
}

export class MyLeaf extends LitElement {
    static get properties() {
        return {
            struct: { type: String },
        }
    }

    render() {
        const jsonStruct = JSON.parse(atob(this.struct));

        return html`<li>${jsonStruct.id}</li>`;
    }
}

window.customElements.define('my-tree', MyTree);
window.customElements.define('my-leaf', MyLeaf);