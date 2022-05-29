import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { useState} from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { addNewItem } from "store/dictionary/actions";

function EmailProviderAdd(props){
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const toggleAddModal = ()=>{
    setAddModal(preValue => !preValue);
  };
  return (
    <React.Fragment >
      <Link to="#" className="btn btn-light" onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>Add New Email Provider</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          Add New Email Provider
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              dispatch(addNewItem(props.id, v));
            }}
          >
            
            
            <div className="mb-3">
              <AvField
                name="emailProviders"
                label="Email Providers"
                placeholder="Email Providers"
                type="text"
                errorMessage="Enter valid email provider"
                validate={{ required: { value: true } }}
              />
            </div>
              
            
            <div className='text-center pt-3 p-2'>
              <Button  type="submit" color="primary" className="">
                     Add New Email Provider
              </Button>
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  id :state.dictionaryReducer.id
});
export default connect(mapStateToProps, null)(EmailProviderAdd);