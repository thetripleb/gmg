const express = require('express')
const router = express.Router()
const dbFactory = require('../data')
const clientFactory = require('../grill')
const util = require('./util')
const url = require('url')
const { metrics, client } = require('../utilities/instrumentation')

router.use(recordHttpMetric)

router.get('/metrics', util.routeHandler(async (req, res) => {
    const snapshot = client.register.metrics()
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(snapshot)
}))

router.get('/status', util.routeHandler(async (req, res) => {
    metrics.status_counter.inc()
    const client = clientFactory.createClient()
    const result = await client.getGrillStatus()

    res.json(result)
}))

router.put('/powertoggle', util.routeHandler(async (req, res) => {
    metrics.powertoggle_counter.inc()
    const client = clientFactory.createClient()
    await client.powerToggleGrill()
    res.sendStatus(200)
}))

router.put('/poweron', util.routeHandler(async (req, res) => {
    metrics.poweron_counter.inc()
    const client = clientFactory.createClient()
    await client.powerOnGrill()
    res.sendStatus(200)
}))

router.put('/poweroff', util.routeHandler(async (req, res) => {
    metrics.poweroff_counter.inc()
    const client = clientFactory.createClient()
    await client.powerOffGrill()
    res.sendStatus(200)
}))

router.put('/temperature/grill/:tempF', util.routeHandler(async (req, res) => {
    metrics.grill_temp_change_counter.inc()
    const client = clientFactory.createClient()
    const temperature = req.params.tempF
    await client.setGrillTemp(temperature)
    res.sendStatus(200)
}))

router.put('/temperature/food/:tempF', util.routeHandler(async (req, res) => {
    metrics.food_temp_change_countere.inc()
    const client = clientFactory.createClient()
    const temperature = req.params.tempF
    await client.setFoodTemp(temperature)
    res.sendStatus(200)
}))

router.get('/temperature/history', util.routeHandler(async (req, res) => {
    const db = await dbFactory.createDb()

    const rows = await db.all(`
        SELECT temperature_log_id, timestamp, grill_temperature, food_temperature
        FROM temperature_log
        WHERE timestamp >= ?;
    `, parseInt(req.query.since, 10))

    res.json(rows)
}))

function recordHttpMetric(req, res, next) {
    const labels = {
        method: req.method,
        path: url.parse(req.url).pathname
    }

    const timer = metrics.http_request_duration_seconds.startTimer(labels)

    const afterResponse = () => {
        labels.status_code = res.statusCode
        res.removeListener('finish', afterResponse)
        timer()
    }

    res.on('finish', afterResponse);
    next()
}

module.exports = router