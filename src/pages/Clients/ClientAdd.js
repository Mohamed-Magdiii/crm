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
import { debounce } from "lodash";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { 
  useState, 
  useEffect, 
  useCallback,
} from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { addNewClient } from "../../store/client/actions";
import { fetchLeadsStart } from "../../store/leads/actions";
import CountryDropDown from "../../components/Common/CountryDropDown";
import { fetchUsers } from "store/users/actions";
import { checkClientEmailApi } from "apis/client";
import { emailCheck } from "common/utils/emailCheck";

function ClientForm(props){
  const dispatch = useDispatch();
  const [addModal, setAddUserModal] = useState(false);
  const [ selectedCountry, setCountry] = useState("");
  const { create } = props.clientPermissions;
  const handleAddLead = (event, values) => {
    event.preventDefault();
    dispatch(addNewClient({
      ...values,
      country: selectedCountry.value
    }));
  }; 

  const countryChangeHandler = (selectedCountryVar) => {
    setCountry(selectedCountryVar);
  };

  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };

  useEffect(() => {
    loadLeads();
    loadUsers();
  }, []);
  
  const loadLeads = (page, limit) => {
    dispatch(fetchLeadsStart({
      limit,
      page
    }));
  };

  const loadUsers = (page, limit) => {
    dispatch(fetchUsers({
      limit,
      page
    }));
  };

  useEffect(() => {
    if (!props.showAddSuccessMessage  && addModal) {
      setAddUserModal(false);
    }
  }, [props.showAddSuccessMessage]);

  const debouncedChangeHandler = useCallback(
    debounce((value, ctx, input, cb) => 
      emailCheck(value, ctx, input, cb, checkClientEmailApi), 1000
    ), []
  );
  console.log(props.error);
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`}  onClick={toggleAddModal}>
        <i className="bx bx-plus me-1" /> 
        {props.t("Add New Client")}
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Client")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddLead(e, v);
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="firstName"
                    label={props.t("First Name")}
                    placeholder={props.t("Enter First Name")}
                    type="text"
                    errorMessage={props.t("Enter First Name")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="lastName"
                    label={props.t("Last Name")}
                    placeholder={props.t("Enter Last Name")}
                    type="text"
                    errorMessage={props.t("Enter Last Name")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="email"
                    label={props.t("Email")}
                    placeholder={props.t("Enter Email")}
                    type="text"
                    errorMessage={props.t("Enter Valid Email")}
                    validate={{
                      required: true,
                      email: true,
                      async: debouncedChangeHandler
                    }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="phone"
                    label={props.t("Phone")}
                    placeholder={props.t("Enter valid Phone")}
                    type="text"
                    onKeyPress={(e) => {
                      if (/^[+]?\d+$/.test(e.key) || e.key === "+") {
                        return true;
                      } else {
                        e.preventDefault();
                      }
                    }}
                    validate={
                      { 
                        required: { value: true },
                        pattern :{
                          // eslint-disable-next-line no-useless-escape
                          value:"/^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im",
                          errorMessage:"Phone number must be digits only with country key"
                        }
                      }
                    }
                  />
                </div>
              </Col>
            </Row> 
            <div className="mb-3">
              <AvField
                name="password"
                label={props.t("Password")}
                placeholder={props.t("Enter Your Password")}
                type="password"
                errorMessage={props.t("Enter Valid Password")}
                validate= {{
                  required: { value : true },
                  pattern :{ 
                    // eslint-disable-next-line no-useless-escape
                    value:"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
                    errorMessage :"Must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"
                  } 
                }}
              />
            </div>
            <div className="mb-3">
              <CountryDropDown 
                selectCountry = {setCountry}
                countryChangeHandler={countryChangeHandler}
              />
            </div>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.disableAddButton} type="submit" color="primary" className="">
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
  error: state.clientReducer.error,
  clientPermissions: state.Profile.clientPermissions,
  showAddSuccessMessage: state.clientReducer.showAddSuccessMessage,
  disableAddButton: state.clientReducer.disableAddButton,
  clients: state.clientReducer.clients,
  leads: state.leadReducer.leads,
  users: state.usersReducer.docs || []
});
export default connect(mapStateToProps, null)(withTranslation()(ClientForm));