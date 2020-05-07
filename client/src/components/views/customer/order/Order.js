import React, {useEffect, useReducer} from 'react'
import {
    Card,
    Form,
    Grid,
    Header,
    Radio
} from "semantic-ui-react";
import Utils from "../../../commons/Utils";
import OngoingOrders from "../../../elements/customer/order/OngoingOrders";
import CompletedOrders from "../../../elements/customer/order/CompletedOrders";
import PopupLeaveReview from "../../../elements/customer/order/review/PopupLeaveReview";
import PopupViewReview from "../../../elements/customer/order/review/PopupViewReview";
import generateReviewSkeleton from "../../../elements/customer/order/review/ReviewSkeleton";
import axios from "axios";

//NOTE: ORDERS SHOULD ALR BE SORTED IN DESC ORDER BASED ON dt_order_placed UNDER BOTH UNCOMPLETED AND COMPLETED ORDER GROUPS
const fakeOrders = {
    data: [
        {oid: 100123, deliveryfee: 4.1, cartcost: 45.4,
            promo_details_text: null, discount_amount: null,
            paymentmode: "Cash On Delivery",
            deliverylocation: "NUS Central Library", riderid: "benwang",
            dt_order_placed: "2020-02-22 19:10:25", dt_rider_departs: "2020-02-22 19:20:00",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 3, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 2, price: 2.9},
                {fid: 102, rid: 1000, rname: "LiWoW", fname: "Brown Sugar Fries", quantity: 3, price: 9.7}
            ]
        },
        {oid: 100121, deliveryfee: 4.1, cartcost: 45.4,
            promo_details_text: null, discount_amount: null,
            paymentmode: "Cash On Delivery",
            deliverylocation: "NUS Central Library", riderid: "benwang",
            dt_order_placed: "2020-02-22 19:10:25", dt_rider_departs: "2020-02-22 19:20:00",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 3, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 2, price: 2.9},
                {fid: 102, rid: 1000, rname: "LiWoW", fname: "Brown Sugar Fries", quantity: 3, price: 9.7}
            ]
        },
        {oid: 100100, deliveryfee: 3.2, cartcost: 9.9,
            promo_details_text: '$3 off on delivery fee', discount_amount: 3,
            paymentmode: "Cash On Delivery",
            deliverylocation: "Kent Ridge MRT Station Exit B", riderid: "chukai",
            dt_order_placed: "2019-12-22 19:10:25", dt_rider_departs: "2019-12-22 19:20:25",
            dt_rider_arrives_rest: "2019-12-22 19:22:25", dt_rider_departs_rest: "2019-12-22 19:25:25",
            dt_order_delivered: "2019-12-22 19:35:00",
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 2, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 1, price: 2.9}
            ], review: null
        },
        {oid: 100000, deliveryfee: 3.2, cartcost: 9.9,
            promo_details_text: null, discount_amount: null,
            paymentmode: "Credit Card",
            deliverylocation: "NUS Central Library", riderid: "phukai",
            dt_order_placed: "2019-12-12 12:10:25", dt_rider_departs: "2019-12-12 12:20:25",
            dt_rider_arrives_rest: "2019-12-12 12:22:25", dt_rider_departs_rest: "2019-12-12 12:25:25",
            dt_order_delivered: "2019-12-12 12:35:00",
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 2, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 1, price: 2.9}
            ],
            review: {
                rider: {riderid: "phukai", rating: 5, review: "Friendly and polite"},
                foodrating: [
                    {fid: 101, fname: "Avocado Melon Tea", rating: 5, review: "Best melon tea in singapore!"},
                    {fid: 100, fname: "Regular Milk Tea", rating: 2, review: "Too bland and the pearls are hard to chew..."}
                ]
            }
        }
    ]
}

const filterOrders = (orders, filter) => {
    switch (filter) {
        case "":
            return orders
        case "ongoing":
            return {...orders, completed_orders: []}
        case "completed":
            return {...orders, uncompleted_orders: []}
    }
}

const groupOrders = (orders) => {
    return {
        uncompleted_orders: orders.filter(x => x.dt_order_delivered === null),
        completed_orders: orders.filter(x => x.dt_order_delivered !== null)
    }
}

export default function Order({userid}) {

    const orderReducer = (state, action) => {
        switch (action.type) {
            case "initialize":
                return {
                    ...state,
                    originalOrders: action.payload,
                    filteredOrders: action.payload
                };
            case "filter":
                return {
                    ...state,
                    filterOption: action.payload,
                    filteredOrders: filterOrders(state.originalOrders, action.payload)
                };
            default:
                return state;
        }
    }

    const [orders, setOrders] = useReducer(orderReducer, {
        originalOrders: {},
        filterOption : "",
        filteredOrders: {}
    })

    const {filterOption, filteredOrders} = orders

    const [showReview, setShowReview] = useReducer(Utils.reducer, {
        viewReview: false,
        leaveReview: false,
        review: null
    })

    const showPopup = (type, boo) => {
        setShowReview({type: type, payload: boo})
        setShowReview({type: "review", payload: null})
    }

    const openReview = (type, boo, order) => {
        if (type === "leaveReview") {
            setShowReview({type: "review", payload: generateReviewSkeleton(order)})
        } else {
            setShowReview({type: "review", payload: order.review})
        }

        setShowReview({type: type, payload: boo})
    }

    const submitReview = (reviews) => {
        showPopup("leaveReview", false)

        //FOR TESTING PURPOSE ONLY - view submitted review at bottom of the page
        setShowReview({type: "review", payload: reviews})

        // submit review to backend

        // retrieve orders from backend again

        // close popup
    }

    useEffect(() => {
        (async() => {
            const allRelevantOrders = await axios
                .get('/customer/shop/getAllOrderDetailsForOneCust/', {
                    params: {
                        cid: userid
                    }
                })
                .then((response) => setOrders({type: "initialize", payload: groupOrders(response.data)})
                )
        })();
    }, []);

    return (
        <>
            <Grid relaxed>
                <Grid.Column width={1}/>
                <Grid.Column width={3}>
                    <Header as={'h1'}>{`My Orders`}</Header>
                    <Card>
                        <Card.Content>
                            <Card.Header>Filter by</Card.Header>
                            <Card.Description>
                                <Form>
                                    <Form.Field>
                                        <Radio label={"All Orders"}
                                               value={""}
                                               checked={filterOption === ""}
                                               onChange={() => setOrders({type: "filter", payload: ""})}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <Radio label={"Ongoing Orders"}
                                               value={"ongoing"}
                                               checked={filterOption === "ongoing"}
                                               onChange={() => setOrders({type: "filter", payload: "ongoing"})}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <Radio label={"Completed Orders"}
                                               value={"completed"}
                                               checked={filterOption === "completed"}
                                               onChange={() => setOrders({type: "filter", payload: "completed"})}
                                        />
                                    </Form.Field>
                                </Form>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>

                <Grid.Column width={8}>
                    {(filterOption === "" || filterOption === "ongoing") &&
                    filteredOrders.uncompleted_orders && filteredOrders.uncompleted_orders.length > 0 &&
                        <OngoingOrders orders={filteredOrders.uncompleted_orders}/>
                    }

                    {(filterOption === "" || filterOption === "completed") &&
                    filteredOrders.completed_orders && filteredOrders.completed_orders.length > 0 &&
                        <CompletedOrders orders={filteredOrders.completed_orders}
                                         openReview={openReview}
                        />
                    }
                </Grid.Column>
                <Grid.Column width={4}/>

            </Grid>

            {showReview.leaveReview && showReview.review &&
                <PopupLeaveReview hidePopup={showPopup} review={showReview.review}
                                  submitReview={submitReview}
                />
            }

            {showReview.viewReview && showReview.review &&
                <PopupViewReview hidePopup={showPopup} review={showReview.review}/>
            }

            {showReview.review &&
                <>
                    <text>{showReview.review.oid}</text>
                    <text>
                        {`rider: ${showReview.review.rider.riderid} rating: ${showReview.review.rider.rating} 
                        review: ${showReview.review.rider.review}`}
                    </text>
                    {showReview.review.foodrating.map(item => (
                        <text>{`food: ${item.fname} rating: ${item.rating} review: ${item.review}`}</text>
                    ))}
                </>
            }
        </>
    )
}