import React from 'react';
import { ErrorMessage } from 'formik'
import _ from 'lodash';

interface textValues {
    name: string,
    type: string,
    setFieldValue: any,
    errors: any,
}

export const FileField = (props: textValues) => {
    return (
        <div className="mb-3">
            <label>Photo: &nbsp;
                <input type={props.type} name={props.name} onChange={(event: any) => { props.setFieldValue("photo", event.target.files) }} />
            </label>
            {!_.isEmpty(props.errors.photo) && <span className="text-danger">The submitted file was not an image. Please choose a different file.
            </span>}
        </div>
    );
};