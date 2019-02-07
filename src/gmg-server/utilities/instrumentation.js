
const client = require('prom-client')

const metrics = {
    http_request_duration_seconds: new client.Histogram({
        name: 'gmg_server_http_request_duration_seconds',
        help: 'duration histogram of http responses labeled with: method and path',
        labelNames: ['method', 'status_code', 'path'],
        buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10]
    }),
    status_counter: new client.Counter({
        name: 'gmg_server_status_counter',
        help: 'number of requests made to fetch status'
    }),
    powertoggle_counter: new client.Counter({
        name: 'vpowertoggle_counter',
        help: 'number of requests made to set power toggle'
    }),
    poweron_counter: new client.Counter({
        name: 'gmg_server_poweron_counter',
        help: 'number of requests made to set power on'
    }),
    poweroff_counter: new client.Counter({
        name: 'gmg_server_poweroff_counter',
        help: 'number of requests made to set power off'
    }),
    grill_temp_change_counter: new client.Counter({
        name: 'gmg_server_grill_temp_change_counter',
        help: 'number of requests made to change grill temp'
    }),
    food_temp_change_countere: new client.Counter({
        name: 'gmg_server_food_temp_change_countere',
        help: 'number of requests made to change food temp'
    }),
    current_grill_temp: new client.Gauge({
        name: 'gmg_server_current_grill_temp',
        help: 'histogram of current grill temp'
    }),
    current_food_temp: new client.Gauge({
        name: 'gmg_server_current_food_temp',
        help: 'histogram of current food temp'
    }),
    desired_grill_temp: new client.Gauge({
        name: 'gmg_server_desired_grill_temp',
        help: 'histogram of desired grill temp'
    }),
    desired_food_temp: new client.Gauge({
        name: 'gmg_server_desired_food_temp',
        help: 'histogram of desired food temp'
    })
}

client.collectDefaultMetrics({ prefix: 'gmg_server_' })

module.exports = {
    metrics,
    client
}