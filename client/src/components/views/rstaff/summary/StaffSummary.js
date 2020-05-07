import React, {useState, useReducer, useEffect} from "react"
import {
    Button,
    Divider,
    Dropdown,
    Grid
} from "semantic-ui-react";
import DateTimeUtils from "../../../commons/DateTimeUtils";
import OrdersSideBar from "../../../elements/rstaff/summary/OrdersSideBar";
import SummaryStatement from "../../../elements/rstaff/summary/SummaryStatement";
import Promotions from "../../../elements/rstaff/summary/Promotions";
import Utils from "../../../commons/Utils";
import PopupEditPromo from "../../../elements/rstaff/summary/PopupEditPromo";
import PopupAddPromo from "../../../elements/rstaff/summary/PopupAddPromo";
import axios from "axios";

const fakeRID = 1

const fakeOrders = {
    data: [
        {oid: 100123, riderid: "benwang",
            dt_order_placed: "2020-02-22 19:10:25", dt_rider_departs: "2020-02-22 19:20:00",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 3, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 2, price: 2.9},
                {fid: 102, rid: 1000, rname: "LiWoW", fname: "Brown Sugar Fries", quantity: 3, price: 9.7}
            ]
        },
        {oid: 100100, riderid: "chukai",
            dt_order_placed: "2020-02-22 09:10:25", dt_rider_departs: "2020-02-22 09:20:25",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 2, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 1, price: 2.9}
            ]
        },
        {oid: 100000, riderid: "chukai",
            dt_order_placed: "2020-02-22 09:10:25", dt_rider_departs: "2020-02-22 09:20:25",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 2, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 1, price: 2.9}
            ]
        }
    ]
}

const fakeStats = {
    data: [
        {month: 3, year: 2020, totalorders: 2000, totalprofit: 34000.20,
            topfavourites: [ // sorted in descending order by qty_sold
                {fid: 100, fname: "Avocado Milk Tea", qty_sold: 200},
                {fid: 101, fname: "Regular Milk Tea", qty_sold: 190},
                {fid: 102, fname: "Brown Sugar Fries", qty_sold: 123},
                {fid: 103, fname: "Brown Sugar Milk Tea", qty_sold: 103},
                {fid: 104, fname: "Creme Brulee", qty_sold: 73}
            ]
        },
        {month: 2, year: 2020, totalorders: 1500, totalprofit: 20000.10,
            topfavourites: [
                {fid: 101, fname: "Regular Milk Tea", qty_sold: 150},
                {fid: 100, fname: "Avocado Milk Tea", qty_sold: 133},
                {fid: 102, fname: "Brown Sugar Fries", qty_sold: 80},
                {fid: 103, fname: "Brown Sugar Milk Tea", qty_sold: 73},
                {fid: 104, fname: "Creme Brulee", qty_sold: 65}
            ]
        }
    ]
}

const fakePromoStats = {
    data: [
        {pid: 1204, promo_details_text: "33% on all food items", start_datetime: "13/03/2020 09:00:00", end_datetime: "13/05/2020 22:00:00",
            promo_type: "PERCENT", promo_cat: "CART",avgorders: 921, promo_min_cost: 100, promo_rate: 0.33,
            promo_max_discount_limit: 20, promo_max_num_redemption: 50},
        {pid: 1205, promo_details_text: "10% on all food items", start_datetime: "01/03/2020 09:00:00", end_datetime: "13/03/2020 22:00:00",
            promo_type: "PERCENT", promo_cat: "CART",avgorders: 762, promo_min_cost: 100, promo_rate: 0.10,
            promo_max_discount_limit: 20, promo_max_num_redemption: 50},
        {pid: 1202, promo_details_text: "Free Delivery", start_datetime: "20/02/2020 09:00:00", end_datetime: "28/02/2020 22:00:00",
            promo_type: "PERCENT", promo_cat: "CART",avgorders: 562, promo_min_cost: 100, promo_rate: 1,
            promo_max_discount_limit: 20, promo_max_num_redemption: 50},
        {pid: 1203, promo_details_text: "24% on all food items", start_datetime: "13/02/2020 09:00:00", end_datetime: "14/02/2020 22:00:00",
            promo_type: "PERCENT", promo_cat: "CART",avgorders: 777, promo_min_cost: 100, promo_rate: 0.24,
            promo_max_discount_limit: 20, promo_max_num_redemption: 50}
    ]
}

const promo_type = ["PERCENT", "DOLLAR"]
const promo_cat = ["DELIVERY", "CART"]

const generateFilterOption = (stats) => {
    return stats.map(item => {
        return item.period
    })
}

const filterStats = (data, filter) => {
    return data.filter(item => item.period === filter)[0]
}

const reducer = (state, action) => {
    switch (action.type) {
        case "initialize":
            return {
                stats: action.payload,
                filterOptions: action.payload && action.payload.length > 0 ?
                    generateFilterOption(action.payload) : null,
                filter: action.payload && action.payload.length > 0 ? action.payload[0].period : null,
                filteredStats: action.payload && action.payload.length > 0 ?
                                filterStats(action.payload, action.payload[0].period) : null
            };
        case "filter":
            return {
                ...state,
                filter: action.payload,
                filteredStats: filterStats(state.stats, action.payload)
            };
        default:
            return state;
    }
}

export default function StaffSummary({userid, rid}) {
    const [orders, setOrders] = useState([])
    const [promotions, setPromotions] = useState([])

    const [filterSummary, setFilterSummary] = useReducer(reducer, {
        stats: [],
        filterOptions: [],
        filter: "",
        filteredStats: {}
    })

    const [showPopup, setShowPopup] = useReducer(Utils.reducer, {
        addPromo: false,
        editPromo: false,
        item: null
    })

    const openPopup = (type, boo, item) => {
        setShowPopup({type: "item", payload: item})
        setShowPopup({type: type, payload: boo})
    }

    const closePopup = (type, boo) => {
        setShowPopup({type: "item", payload: null})
        setShowPopup({type: type, payload: boo})
    }

    const {stats, filterOptions, filter, filteredStats} = filterSummary

    const options = filterOptions.map(item => ({
        key: item,
        text: item,
        value: item
    }))

    useEffect(() => {
        (async() => {
            const allRelevantOrders = await axios
                .get('/staff/getAllOrders/', {
                    params: {
                        rid: rid
                    }
                })
                .then((response) => setOrders(response.data))

            const mostPopularItemsByMonth = await axios
                .get('/staff/getMostPopularByMonth/', {
                    params: {
                        rid: rid
                    }
                })
                .then((response) => setFilterSummary({type: "initialize", payload: DateTimeUtils.formatDataPeriod(response.data)}))

            const promoStats = await axios
                .get('/staff/getPromoStats/', {
                    params: {
                        rid: rid
                    }
                })
                .then((response) => setPromotions(response.data)
                )
        })()
    }, [])

    const submitAddPromo = async (item) => {
        let min_cost = item.promo_min_cost >= 0 ? item.promo_min_cost : null
        let max_disc = item.promo_max_discount_limit >= 0 ? item.promo_max_discount_limit : null
        let max_redemp = item.promo_max_num_redemption >= 0 ? item.promo_max_num_redemption : null

        await axios
            .post('/staff/addNewPromo/', {
                promo_rate: item.promo_rate,
                promo_type: item.promo_type,
                promo_cat: item.promo_cat,
                start_datetime: DateTimeUtils.stringtifyPromoDT(item.start_datetime),
                end_datetime: DateTimeUtils.stringtifyPromoDT(item.end_datetime),
                promo_min_cost: min_cost,
                promo_max_discount_limit: max_disc,
                promo_max_num_redemption: max_redemp,
                promo_details_text: item.promo_details_text,
                rid: rid
            })
            .then( (resp) => {
                console.log(resp);
            }, (error) => {
                console.log(error);
            });

        await axios
            .get('/staff/getPromoStats/', {
                params: {
                    rid: rid
                }
            })
            .then((response) => setPromotions(response.data)
            )
        closePopup("addPromo", false)
    }

    const submitEditPromo = async (item) => {
        let min_cost = item.promo_min_cost >= 0 ? item.promo_min_cost : null
        let max_disc = item.promo_max_discount_limit >= 0 ? item.promo_max_discount_limit : null
        let max_redemp = item.promo_max_num_redemption >= 0 ? item.promo_max_num_redemption : null

        await axios
            .post('/staff/editPromo/', {
                pid: item.pid,
                promo_rate: item.promo_rate,
                promo_type: item.promo_type,
                promo_cat: item.promo_cat,
                start_datetime: DateTimeUtils.stringtifyPromoDT(item.start_datetime),
                end_datetime: DateTimeUtils.stringtifyPromoDT(item.end_datetime),
                promo_min_cost: min_cost,
                promo_max_discount_limit: max_disc,
                promo_max_num_redemption: max_redemp,
                promo_details_text: item.promo_details_text
            })
            .then( (resp) => {
                console.log(resp);
            }, (error) => {
                console.log(error);
            });

        await axios
            .get('/staff/getPromoStats/', {
                params: {
                    rid: rid
                }
            })
            .then((response) => setPromotions(response.data)
            )
        closePopup("editPromo", false)
    }

    const submitDeletePromo = async (item) => {
        await axios
            .delete('/staff/deletePromo/', {
                params: {
                    pid: item.pid
                }})
            .then( (resp) => {
                console.log(resp);
            }, (error) => {
                console.log(error);
            });

        await axios
            .get('/staff/getPromoStats/', {
                params: {
                    rid: rid
                }
            })
            .then((response) => setPromotions(response.data)
            )
        closePopup("editPromo", false)
    }

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={1}/>

                    <Grid.Column width={11} textAlign={"left"}>
                        {(!stats || stats.length < 1) && (<h1>No Summary</h1>)}
                        {stats && stats.length > 0 && (
                            <Grid.Row>
                                <h1>Summary of {' '}
                                    <Dropdown
                                        inline
                                        options={options}
                                        value={filter}
                                        onChange={(e, { value }) => {
                                            setFilterSummary({type: "filter", payload: value})
                                        }}
                                    />
                                </h1>
                                <SummaryStatement stats={filteredStats}/>
                            </Grid.Row>
                        )}

                        <Divider/>

                        <Grid.Row>
                            <h1>Promotions</h1>
                            <Button floated={'right'} size={'mini'} color={'pink'}
                                    content={'Add Promo'} onClick={() => openPopup("addPromo", true, null)}
                            />
                            {(!promotions || promotions.length < 1) && (<h2>No Promotions</h2>)}
                            {promotions && promotions.length > 0 && (
                                <Promotions promotions={promotions} openPromo={openPopup}/>
                            )}
                        </Grid.Row>
                    </Grid.Column>

                    <Grid.Column width={4}>
                        <h2>Pending Orders</h2>
                        <Divider/>
                        <OrdersSideBar orders={orders} className={'child'}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {showPopup.editPromo && showPopup.item && (
                <PopupEditPromo closePopup={closePopup}
                                submitDeletePromo={submitDeletePromo} submitEditPromo={submitEditPromo}
                                item={showPopup.item} types={promo_type} cats={promo_cat}/>
            )}

            {showPopup.addPromo && (
                <PopupAddPromo closePopup={closePopup} submitAddPromo={submitAddPromo}
                               types={promo_type} cats={promo_cat}/>
            )}
        </>
    )
}