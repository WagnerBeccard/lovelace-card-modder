var LitElement = LitElement || Object.getPrototypeOf(customElements.get('hui-error-entity-row'));
class CardModder extends LitElement {

  async setConfig(config) {
    if(!window.cardTools) throw new Error(`Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools`);
    window.cardTools.checkVersion(0.2);

    if(!config || !config.card) {
      throw new Error("Card config incorrect");
    }
    this._config = config;
    this.card = window.cardTools.createCard(config.card);
    this.templated = [];
  }

  render() {
    return window.cardTools.litHtml`
    <div id="root">${this.card}</div>
    `;
  }

  firstUpdated() {
    this._cardMod();
  }

  _cardMod() {
    if(!this._config.style) return;

    let target = null;
    target = target || this.card.querySelector("ha-card");
    target = target || this.card.shadowRoot && this.card.shadowRoot.querySelector("ha-card");
    target = target || this.card.firstChild && this.card.firstChild.shadowRoot && this.card.firstChild.shadowRoot.querySelector("ha-card");
    target = target || this.card;

    for(var k in this._config.style) {
      if(window.cardTools.hasTemplate(this._config.style[k]))
        this.templated.push(k);
      target.style.setProperty(k, window.cardTools.parseTemplate(this._config.style[k]));
    }
    this.target = target;
  }

  set hass(hass) {
    if(this.card) this.card.hass = hass;
    this.templated.forEach((k) => {
      this.target.style.setProperty(k, window.cardTools.parseTemplate(this._config.style[k], ''));
    });
  }

  getCardSize() {
    return this._config.report_size ? this._config.report_size : this.card ? this.card.getCardSize() : 1;
  }
}

customElements.define('card-modder', CardModder);
