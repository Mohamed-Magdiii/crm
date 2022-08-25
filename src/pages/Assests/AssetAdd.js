import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row, 
  Label
} from "reactstrap";

import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { addNewSymbol } from "store/assests/actions";
import { withTranslation } from "react-i18next";
function AssestForm(props){

  const [addModal, setAddUserModal] = useState(false);
  const [file, setFile] = useState({});
  const dispatch = useDispatch();
  const { create } = props.symbolsPermissions;
  const handleAddLead = (event, values) => {
    event.preventDefault(); 
    const formData = new FormData();
    formData.append("image", file);
    formData.append("symbol",  values.symbol);
    formData.set("minAmount", JSON.stringify({
      deposit :values.minDepositAmount,
      withdrawal:values.minWithdrawAmount
    }));
    formData.set("fee", JSON.stringify({
      deposit:values.depositFee,
      withdrawal:values.withdrawFee
    }));
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("markup", values.markup);
    formData.append("explorerLink", values.explorerLink);
    dispatch(addNewSymbol(formData));
    
  }; 

  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };

  useEffect(() => {
    if (props.clearModal  && addModal) {
      
      setAddUserModal(false);
      
    }
  }, [props.clearModal]);

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Symbol")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true} size="lg">
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Symbol")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddLead(e, v);
            }}
            id="form"
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="name"
                    label={props.t("Name")}
                    placeholder={props.t("Enter Name")}
                    type="text"
                    errorMessage={props.t("Enter name of the symbol")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="symbol"
                    label={props.t("Symbol")}
                    placeholder={props.t("Enter Symbol")}
                    type="text"
                    errorMessage={props.t("Enter symbol")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="description"
                    label={props.t("Description")}
                    placeholder={props.t("Enter Description")}
                    type="text"
                    errorMessage={props.t("Enter description")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="markup"
                    label={props.t("Mark up")}
                    placeholder={props.t("Markup")}
                    type="text"
                    errorMessage={props.t("Enter valid markup")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row> 
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="depositFee"
                    label={props.t("Desposit Fee")}
                    placeholder={props.t("Enter Desposit Fee")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid deposit fee")}
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="withdrawFee"
                    label={props.t("Withdraw Fee")}
                    placeholder={props.t("Enter Withdrawal Fee")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid withdraw fee")}
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="minDepositAmount"
                    label={props.t("Min Deposit Amount")}
                    placeholder={props.t("Enter Min Deposit Amount")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid deposit amount")}
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="minWithdrawAmount"
                    label={props.t("Min Withdraw Amount")}
                    placeholder={props.t("Enter Min Withdrawal Amount")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid withdraw amount")}
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <AvField
                name="explorerLink"
                label={props.t("Link")}
                placeholder={props.t("Enter Link")}
                type="text"
                errorMessage={props.t("explorer link")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <Label>Asset Image</Label>
              <AvField
                name="image"
                type="file"
                errorMessage={props.t("Please upload an image for the symbol")}
                validate = {{ required :{ value:true } }}
                accept ="image/jpg,image/png"
                onChange = {(e)=>setFile(e.target.files[0])}
              />
            </div>
            
            <div className='text-center pt-3 p-2'>
              <Button  disabled = {props.disableAddButton} type="submit" color="primary" className="">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  error: state.assetReducer.error,
  symbolsPermissions: state.Profile.symbolsPermissions || {},
  disableAddButton: state.assetReducer.disableAddButton,
  clearModal: state.assetReducer.clearModal 
});
export default connect(mapStateToProps, null)(withTranslation()(AssestForm));