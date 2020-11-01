
import React, { Component } from 'react';
import axios from 'axios';
import {Button, Input} from '@material-ui/core'

class FormComponent extends Component {
    state = {
        // No file is selected initially
        selectedFile: null,
    }

    onUploadFile = async () => {
        const formData = new FormData();
        formData.append(
            "uploadedfile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log("File is uploading");
        console.log(this.state.selectedFile);

        // http://localhost:9000/api/v1/upload
        var response = await axios.post("https://vendorappapi.herokuapp.com/api/v1/upload", formData)
        console.log(response);

    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
        console.log(this.state.selectedFile);
    };

    render() {

        return (
            <div className="fi">
               Upload Your File
               <div className="upload">
                <Input type="file" color="primary" id="outlined-basic" label="Outlined" onChange={this.onFileChange} />
                <Button color="primary" variant="contained" onClick={this.onUploadFile} className="btn">Upload</Button>
                </div>
            </div>
        );
    }
}

export default FormComponent

