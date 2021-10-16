class Country {
    constructor(name, confirmed, deaths, critical, recovered) {
        this._name = name;
        this._confirmed = confirmed;
        this._confirmed = confirmed;
        this._deaths = deaths;
        this._critical = critical;
        this._recovered = recovered;
    }

    get name() {
        return this._name;
    }

    get confirmed() {
        return this._confirmed;
    }

    get deaths() {
        return this._deaths;
    }

    get critical() {
        return this._critical;
    }

    get recovered() {
        return this._recovered;
    }
}