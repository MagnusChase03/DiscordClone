
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

export default function sendMessage(props) {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);

    function generateForm(object) {
        var formBody = [];
        for (var property in object) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(object[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return formBody;
    }

    function sendMessage(data) {
        const messageObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            usid: cookies.usid,
            content: data.message
        }

        fetch(serverURL + "/server/message", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: generateForm(messageObject),
        })
            .then((response) => response.json());
            // .then((data) => { console.log(data) });

        props.updateMessages(props.messages + 1);
    }


    const ErrorSchema = Yup.object().shape({
        message: Yup.string().required('Required'),
    });

    return (
        <>
            <Formik
                // Initial values for fields
                initialValues={{
                    message: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { sendMessage(values); values.message = ""; }}
            >
                {({ errors, touched }) => (
                    <Form className="messageForm">
                        <Field id="message" name="message" placeholder="Message" />
                        <button type="submit">Send</button>
                        {touched.message && errors.message && <div className="messageErrors">{errors.message}</div>}
                    </Form>
                )}
            </Formik>

        </>
    );
}