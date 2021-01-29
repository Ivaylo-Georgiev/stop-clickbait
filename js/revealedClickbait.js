class RevealedClickbait extends HTMLElement {
    constructor() {
        super();

        const templateHTML = `
        <style>
            @import "/css/revealedClickbaitStyle.css"
        </style>

        <div class="article">
            <slot name="article-image"></slot>
            <slot name="article-title"></slot>
            <div class="article-meta">
                <p>Source: <slot name="article-source"></slot></p>
                <slot name="article-votes"></slot>
            </div>
            <slot name="article-reveal"></slot>
            <slot name="delete-button"></slot>
        </div>
        `;
        const template = document.createElement('template');
        template.innerHTML = templateHTML;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('revealed-clickbait', RevealedClickbait);