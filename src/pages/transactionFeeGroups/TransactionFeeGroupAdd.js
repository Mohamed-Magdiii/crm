import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row,
  Collapse,
  Label,
} from "reactstrap";
import classnames from "classnames";
import { fetchAssetsStart } from "store/assests/actions";

import { Link } from "react-router-dom";
import {
  AvForm,
  AvField,
  AvInput,
  AvGroup
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { addTransactionFeesGroupStart } from "store/transactionFeeGroups/actions";
function TransactionFeeGroupAdd(props) {
  const [col1, setcol1] = useState(false);
  const [value, setValue] = useState(0);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [addModal, setAddUserModal] = useState(false);
  const [isPercentage, setIsPercentage] = useState(false);
  const { create } = props.transactionFeeGroupsPermissions;
  const dispatch = useDispatch();
  useEffect(() => {
    // if (col1 == true) {
    loadAssests(1, 100);
    // }
  }, []);

  const loadAssests = (page, limit) => {
    dispatch(fetchAssetsStart({
      limit,
      page
    }));
  };

  const handleAddFeesGroup = (event, values) => {

    event.preventDefault();
    const { isPercentage, maxValue, title, minValue, value } = values;
    let assetsOpj;
    props.assets.forEach((asset, i) => {
      assetsOpj = {
        ...assetsOpj,
        [`${asset.symbol}`]: {
          value: values[`value${i}`],
          minValue: values[`minValue${i}`],
          maxValue: values[`maxValue${i}`]
        }

      };
    });
    dispatch(addTransactionFeesGroupStart({
      isPercentage,
      minValue,
      maxValue,
      title,
      assets: { ...assetsOpj },
      value
    }));
  };
  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };
  const t_col1 = () => {
    setcol1(!col1);
  };
  useEffect(() => {
    if (!props.showAddSuccessMessage && addModal) {

      setAddUserModal(false);
    }
  }, [props.showAddSuccessMessage]);

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1" />
        {props.t("Add New Transaction Fees Group")}
      </Link>
      <Modal size="lg"
        style={{
          maxWidth: "800px",
          width: "100%"
        }}
        isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Transaction Fees Group")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddFeesGroup(e, v);
            }}
          >
            <Row>
              <Row>
                <Col  >
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Title")}
                    type="text"
                    errorMessage={props.t("Enter Valid title")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </Row>

              <Col>
                <br />
                <div className="mb-3">
                  <AvGroup check>
                    <AvInput type="checkbox" name="isPercentage" onClick={() => setIsPercentage(preValue => !preValue)} value={isPercentage ? "true" : "false"} />
                    <Label check for="checkItOut">Is Percentage</Label>
                  </AvGroup>
                </div>
              </Col>
              {/* </Row> */}

              <Row>

                <Col md="2">
                  <label className="form-check-label"></label>
                  <h6>Defaults:</h6>
                </Col>
                <Col md="4">
                  <AvField
                    name="value"
                    label={props.t("Value")}
                    placeholder={props.t("value")}
                    type="number"
                    errorMessage={props.t("Enter valid fees group value")}
                    validate={{ required: { value: true } }}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Col>
                <Col md="3">
                  <AvField
                    name="minValue"
                    label={props.t("Min value")}
                    placeholder={props.t("min value")}
                    type="number"
                    errorMessage={props.t("Enter valid min fees group value")}
                    validate={{ required: { value: true } }}
                    onChange={(e) => setMinAmount(e.target.value)}
                  />
                </Col>
                <Col md="3">
                  <AvField
                    name="maxValue"
                    label={props.t("Max Value")}
                    placeholder={props.t("Max Value")}
                    type="number"
                    errorMessage={props.t("Enter Valid max feees group value")}
                    validate={{ required: { value: true } }}
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </Col>
              </Row>
            </Row>
            <br />
            <br />
            <Col >
              <div className="accordion" id="accordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className={classnames(
                        "accordion-button",
                        "fw-medium",
                        { collapsed: !col1 }
                      )}
                      type="button"
                      onClick={t_col1}
                      style={{ cursor: "pointer" }}
                    >
                      Individual Asset fees
                    </button>
                  </h2>

                  <Collapse isOpen={col1} className="accordion-collapse">
                    <div className="accordion-body">
                      {props.assets?.map((asset, index) =>
                        <Row key={index}>
                          <Col md="2">
                            <label className="form-check-label"></label>
                            <h5> {asset.symbol}</h5>
                          </Col>
                          {/* <div className="mb-3">
                            <Label htmlFor="example-text-input" className="form-Label">{props.t("Value")}</Label>
                            <Input className="form-control" type="text" defaultValue="Artisanal kale" id="example-text-input" />
                          </div> */}
                          <Col md="3">
                            <AvField
                              name={`value${index}`}
                              label={props.t("Value")}
                              value={value}
                              placeholder={props.t("Value")}
                              type="number"
                              errorMessage={props.t("Enter valid min fees group value")}
                              validate={{ required: { value: true } }}
                            />
                          </Col>
                          <Col md="3">
                            <AvField
                              name={`minValue${index}`}
                              value={minAmount}
                              label={props.t("Min value")}
                              placeholder={props.t("min value")}
                              type="number"
                              errorMessage={props.t("Enter valid min fees group value")}
                              validate={{ required: { value: true } }}
                            />
                          </Col>
                          <Col md="3">
                            <AvField
                              name={`maxValue${index}`}
                              value={maxAmount}
                              label={props.t("Max value")}
                              placeholder={props.t("Max value")}
                              type="number"
                              errorMessage={props.t("Enter valid min fees group value")}
                              validate={{ required: { value: true } }}
                            />
                          </Col>
                        </Row>
                      )}
                    </div>
                  </Collapse>
                </div>
              </div>
            </Col>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addButtonDisabled} type="submit" color="primary" className="">
                {props.t("Add New Transaction Fees Group")}
              </Button>
            </div>
          </AvForm>
          {
            props.error && (
              <UncontrolledAlert color="danger">
                <i className="mdi mdi-block-helper me-2" />
                {props.t(props.error)}
              </UncontrolledAlert>
            )
          }
          {
            props.showAddSuccessMessage && (
              <UncontrolledAlert color="success">
                <i className="mdi mdi-check-all me-2" />
                {props.t("Transaction New Fees Group is added successfully !!!")}
              </UncontrolledAlert>
            )
          }
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  error: state.transactionFeeGroupReducer.error,
  showAddSuccessMessage: state.transactionFeeGroupReducer.showAddSuccessMessage,
  addButtonDisabled: state.transactionFeeGroupReducer.addButtonDisabled,
  assets: state.assetReducer.assets || [],
  transactionFeeGroupsPermissions: state.Profile.transactionFeeGroupsPermissions || {}
});

export default connect(mapStateToProps, null)(withTranslation()(TransactionFeeGroupAdd));