const config = require('config')
const PollingManager = require('../utilities/PollingManager')
const EventEmitter = require('events')
const { metrics } = require('../utilities/instrumentation')

class PollingClient extends EventEmitter {
    constructor({ client, logger, options = config.get('status') }) {
        super()
        this._pollingManager = new PollingManager({ ...options, logger })
        this._client = client
        this._logger = (message) => {
            if (!logger) return
            logger(message)
        }

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
    }

    async start() {
        await this._pollingManager.start({
            task: async () => {
                // Get current grill status
                this._logger('Fetching grill status')
                const status = await this._client.getGrillStatus()
                metrics.current_food_temp.set(status.currentFoodTemp)
                metrics.desired_food_temp.set(status.desiredFoodTemp)
                metrics.current_grill_temp.set(status.currentGrillTemp)
                metrics.desired_grill_temp.set(status.desiredGrillTemp)

                this.emit('status', status)
            },
            context: this
        })
    }

    async stop() {
        await this._pollingManager.stop()
    }
}

module.exports = PollingClient