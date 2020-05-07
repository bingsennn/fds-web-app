import React from "react"
import {
    Button,
    Divider,
    Form,
    Input,
    Dropdown,
    Grid,
    Label, Header
} from "semantic-ui-react";
import * as Yup from "yup";
import { Formik } from "formik";
import moment from "moment"
import DatePicker from "react-datepicker/es";
import "../../../stylesheets/Popup.css"

export default function PopupAddPromo({closePopup, types, cats, submitAddPromo}) {
    const AddPromoSchema = Yup.object().shape({
        promo_details_text: Yup.string().required("Promo details is required"),
        promo_type: Yup.string().required("Promo type is required"),
        promo_cat: Yup.string().required("Promo category is required"),

        promo_rate: Yup.number().when('promo_type', {
            is: (val) => val === "PERCENT",
            then: Yup.number().required("Promo rate is required").moreThan(0).max(1, "Promo rate should not exceed 100%!"),
            otherwise: Yup.number().required("Promo rate is required").moreThan(0)}),

        promo_min_cost: Yup.number().nullable(true).optional(),
        promo_max_discount_limit: Yup.number().nullable(true).optional(),
        promo_max_num_redemption: Yup.number().nullable(true).optional(),
        start_datetime: Yup.date().required("Start Date is required").min(moment().toDate(), "Start date must be present time"),
        end_datetime: Yup.date().required("End date is required")
            .min(moment().toDate(), "End date must be present time")
            .when("start_datetime", (start_datetime, yup) => start_datetime &&
                yup.min(moment(start_datetime).add(5,'minute').toDate(), "End time must have at least 5 minutes interval from start time"))

    })

    function dropdown_opt (data) {
        return data.map(item => ({
            key: item,
            text: item,
            value: item
        }))}

    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={() => closePopup("addPromo", false)}>x</span>
                <>
                    <h1>Add New Promotion</h1>
                    <Divider/>

                    <Formik
                        initialValues={{
                            promo_details_text: "",
                            promo_type: types[0], promo_cat: cats[0], promo_rate: null,
                            start_datetime: "",
                            end_datetime: "",
                            promo_max_discount_limit: null, promo_min_cost: null,
                            promo_max_num_redemption: null
                        }}
                        validationSchema={AddPromoSchema}
                        onSubmit={(values) => submitAddPromo(values)}
                    >

                        {( {values,
                               errors,
                               touched,
                               handleChange,
                               handleBlur,
                               handleSubmit,
                               isSubmitting,
                               setFieldValue }) => (
                            <Form>
                                <Grid textAlign={'left'}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                placeholder={values.promo_details_text}
                                                label={'Promo Name*'}
                                                type="text"
                                                name="promo_details_text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.promo_details_text}
                                                className={touched.promo_details_text && errors.promo_details_text ? "has-error" : null}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column>
                                            {touched.promo_details_text && errors.promo_details_text ? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.promo_details_text}
                                                </Label>
                                            ): null}
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column width={6}>
                                            <span>
                                                Type: {' '}
                                                <Dropdown
                                                    search selection
                                                    name="promo_type"
                                                    options={dropdown_opt(types)}
                                                    value={values.promo_type}
                                                    onChange={(e, { name, value }) => {
                                                        handleChange(e)
                                                        setFieldValue(name, value)
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </span>
                                        </Grid.Column>

                                        <Grid.Column width={6}>
                                            <span>
                                                Category: {' '}
                                                <Dropdown
                                                    search selection
                                                    name="promo_cat"
                                                    options={dropdown_opt(cats)}
                                                    value={values.promo_cat}
                                                    onChange={(e, { name, value }) => {
                                                        handleChange(e)
                                                        setFieldValue(name, value)
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </span>
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column width={5}>
                                            <Input
                                                placeholder={values.promo_rate}
                                                label={'Promo Rate*'}
                                                type="text"
                                                name="promo_rate"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.promo_rate}
                                                className={touched.promo_rate && errors.promo_rate ? "has-error" : null}
                                            />
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Input
                                                placeholder={values.promo_min_cost}
                                                label={'Min Cost'}
                                                type="text"
                                                name="promo_min_cost"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.promo_min_cost}
                                                className={touched.promo_min_cost && errors.promo_min_cost ? "has-error" : null}
                                            />
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            <Input
                                                placeholder={values.promo_max_discount_limit}
                                                label={'Max Discount'}
                                                type="text"
                                                name="promo_max_discount_limit"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.promo_max_discount_limit}
                                                className={touched.promo_max_discount_limit && errors.promo_max_discount_limit ? "has-error" : null}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column width={5}>
                                            {touched.promo_rate && errors.promo_rate? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.promo_rate}
                                                </Label>
                                            ): null}
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            {touched.promo_min_cost && errors.promo_min_cost? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.promo_min_cost}
                                                </Label>
                                            ): null}
                                        </Grid.Column>

                                        <Grid.Column width={4}>
                                            {touched.promo_max_discount_limit && errors.promo_max_discount_limit ? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.promo_max_discount_limit}
                                                </Label>
                                            ): null}
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                placeholder={values.promo_max_num_redemption}
                                                label={'Max Redemption'}
                                                type="text"
                                                name="promo_max_num_redemption"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.promo_max_num_redemption}
                                                className={touched.promo_max_num_redemption && errors.promo_max_num_redemption ? "has-error" : null}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column>
                                            {touched.promo_max_num_redemption && errors.promo_max_num_redemption ? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.promo_max_num_redemption}
                                                </Label>
                                            ): null}
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column width={8}>
                                            <Header sub>Start Date*</Header>
                                            <DatePicker
                                                showTimeSelect
                                                type="date"
                                                selected={values.start_datetime}
                                                onChange={value => {
                                                    setFieldValue("start_datetime", value)
                                                }}
                                                name={"start_datetime"}
                                                dateFormat="dd/MM/yyyy h:mm aa"
                                                minDate={moment().toDate()}
                                                selectsStart
                                                startDate={values.start_datetime}
                                                endDate={values.end_datetime}
                                                onBlur={handleBlur}
                                                value={values.start_datetime}
                                                className={touched.start_datetime && errors.start_datetime ? "has-error" : null}
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Header sub>End Date*</Header>
                                            <DatePicker
                                                showTimeSelect
                                                type="date"
                                                selected={values.end_datetime}
                                                onChange={value => {
                                                    setFieldValue("end_datetime", value)
                                                }}
                                                name={"start_datetime"}
                                                dateFormat="dd/MM/yyyy h:mm aa"
                                                minDate={
                                                    values.start_datetime
                                                        ? moment(values.start_datetime).add(5, 'minute').toDate()
                                                        : moment().add(5, 'minute').toDate()
                                                }
                                                selectsEnd
                                                startDate={values.start_datetime}
                                                endDate={values.end_datetime}
                                                onBlur={handleBlur}
                                                value={values.end_datetime}
                                                className={touched.end_datetime && errors.end_datetime ? "has-error" : null}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column width={8}>
                                            {touched.start_datetime && errors.start_datetime ? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.start_datetime}
                                                </Label>
                                            ): null}
                                        </Grid.Column>

                                        <Grid.Column width={8}>
                                            {touched.end_datetime && errors.end_datetime ? (
                                                <Label className="error-message" basic color='red' pointing>
                                                    {errors.end_datetime}
                                                </Label>
                                            ): null}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>

                                <Form.Button
                                    floated={'center'} size="medium"
                                    content={'Add Promo'}
                                    color={'orange'}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                />
                            </Form>
                        ) }
                    </Formik>
                </>
            </div>
        </div>
    )
}