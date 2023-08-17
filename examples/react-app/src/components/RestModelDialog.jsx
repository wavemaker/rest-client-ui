import { Dialog, DialogContent } from "@mui/material";
import { min } from "lodash";
import { useEffect } from "react";


export default function RestModal({ handleOpen, handleClose, defaultData }) {

    useEffect(() => {
        if (handleOpen & !defaultData) {
            setTimeout(() => {
                window.RestImport({
                    dom_id: "#reactImport",
                    config: {
                        url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
                        httpMethod: 'POST',
                        useProxy: true,
                        httpAuth: "BASIC",
                        bodyParams: "{userName:password}",
                        userName: "userName",
                        userPassword: "userPassword",
                        headerParams: [
                            {
                                name: 'New',
                                type: 'string',
                                value: 'application'
                            }
                        ],
                        multipartParams: [
                            {
                                name: "post",
                                type: "file",
                                value: "fe"
                            }
                        ],
                        contentType: 'multipart/form-data'
                    },

                });
            }, 500);
        } else if (handleOpen & defaultData) {
            setTimeout(() => {
                window.RestImport({
                    dom_id: "#reactImport",
                });
            }, 500);
        }
    }, [handleOpen])

    return (
        <>
            <Dialog open={handleOpen} onClose={handleClose} maxWidth={'lg'} >
                <DialogContent id="reactImport">

                </DialogContent>
            </Dialog>
        </>
    )
}