const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const TPL_SHORT = '<p><span class="hours">HH</span>:<span class="minutes">mm</span>:<span class="seconds">ss</span></p>';
const TPL_ALERT = '<p class="app--extra-time"><span class="hours">HH</span>:<span class="minutes">mm</span>:<span class="seconds">ss</span></p>';

/**
 * App script.js
 */
export default {
    name    : 'app-layout',
    /**
     * @override
     */
    data()
    {
        return {
            interval    : null,
            counter     : -1,
            chrono      : '',
            date        : '',
            status      : 'new',
            storeKey    : '@amjs::working-on',
            today       : ''
        };
    },
    watch   : {
        /**
         * Observes any change on `counter` data value.
         * @param   {*} value   New value
         */
        'counter'(value)
        {
            if (value >= 0)
            {
                const tpl = value >= HOUR * 8
                    ? TPL_ALERT
                    : TPL_SHORT;
                this.chrono = this._toString(tpl);
                this._updateTitle();
            }
        },
        /**
         * Observes any change on `status` data value.
         * @param   {*} value   New value
         */
        'status'(value)
        {
            switch (value)
            {
                case 'running':
                    this._onRunning();
                    break;
                case 'paused':
                    this._onPause();
                    break;
                case 'stopped':
                    this._onStop();
                    break;
                default:
                    break;
            }
        }
    },
    methods : {
        /**
         * Executed on `status = "running"`
         * @private
         */
        _onRunning()
        {
            if (this.counter < 0)
            {
                this.counter = 0;
                this.interval = setInterval(() => this.counter += SECOND, SECOND);
                this.status = 'running';
            }
            else
            {
                this.interval = setInterval(() => this.counter += SECOND, SECOND);
                this.status = 'running';
            }
        },
        /**
         * Executed on `status = "paused"`
         * @private
         */
        _onPause()
        {
            if (this.interval)
            {
                clearInterval(this.interval);
                this.status = 'paused';
            }
        },
        /**
         * Executed on `status = "stopped"`
         * @private
         */
        _onStop()
        {
            if (this.interval)
            {
                clearInterval(this.interval);
            }
        },
        /**
         * Executed on submit event from form
         * @param   {Event} e   FormEvent
         * @private
         */
        _onSubmit(e)
        {
            if (e instanceof Event)
            {
                e.preventDefault();
            }

            const milliseconds = this.counter;
            this.status = 'new';
            this.counter = -1;
            this._intoStore(milliseconds);
        },
        /**
         * Executed on clicking "reset" button
         * @private
         */
        _onReset()
        {
            if (this.interval)
            {
                clearInterval(this.interval);
            }
            this.counter = 0;
            this.status = 'new';
        },
        /**
         * Saves current date counter time
         * @param   {Number}    milliseconds    Time gone
         * @private
         */
        _intoStore(milliseconds = 0)
        {
            let obj;
            try
            {
                obj = JSON.parse(window.localStorage.getItem(this.storeKey)) || {};
            }
            catch (e)
            {
                obj = {};
            }
            obj[this.today] = milliseconds;
            window.localStorage.setItem(this.storeKey, JSON.stringify(obj));

            // @todo send into backend
        },
        /**
         * Retrieves stored count time for current date
         * @return  {Number}    Time gone in milliseconds
         * @private
         */
        _fromStore()
        {
            let obj;
            try
            {
                obj = JSON.parse(window.localStorage.getItem(this.storeKey));
            }
            catch (e)
            {
                obj = null;
            }

            return obj && obj[this.today] ? Number(obj[this.today]) : -1;
        },
        /**
         * Transforms a Date into an string text replaces placeholder values
         * @param   {String}    str Placeholder string date format
         * @return  {String}    Date formatted as `str` states
         * @private
         */
        _toString(str = 'HH:mm:ss')
        {
            let date;
            if (this.counter >= 0)
            {
                date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(this.counter);
            }
            else
            {
                date = new Date();
            }

            return str.replace(/(\w+)/g,
                match =>
                {
                    let value = 'XX';
                    switch (match)
                    {
                        case 'HH':
                            value = date.getHours().toString()
                                .padStart(2, '0');
                            break;
                        case 'mm':
                            value = date.getMinutes().toString()
                                .padStart(2, '0');
                            break;
                        case 'ss':
                            value = date.getSeconds().toString()
                                .padStart(2, '0');
                            break;
                        case 'dd':
                        case 'DD':
                            value = date.getDate().toString()
                                .padStart(2, '0');
                            break;
                        case 'MM':
                            value = Number(date.getMonth() + 1).toString()
                                .padStart(2, '0');
                            break;
                        case 'yyyy':
                        case 'YYYY':
                            value = date.getFullYear();
                            break;
                        default:
                            value = match;
                    }

                    return value;
                }
            );
        },
        /**
         * Updates document title to flag current spent time
         * @private
         */
        _updateTitle()
        {
            document.head.querySelector('title').innerText = `[${this._toString('HH:mm:ss')}] @amjs/working-on`;
        }
    },
    /**
     * @override
     */
    mounted()
    {
        this.today = this._toString('yyyy-MM-dd');
        this.date = this._toString('<span>dd/MM/yyyy</span>');
        this.counter = this._fromStore();
    }
};
