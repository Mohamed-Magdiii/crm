import React, { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Row, 
  Col,
  Card, 
  CardBody, 
  CardTitle, 
  CardHeader,
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import ClientAdd from "./ClientAdd";
import TodoAdd from "components/Common/TodoAdd";

import { fetchClientsStart } from "store/client/actions";
import "./ClientList.styles.scss";
import SearchBar from "components/Common/SearchBar";
import { Link } from "react-router-dom";
import { captilazeFirstLetter, displaySubString } from "common/utils/manipulateString";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import AgentForm from "./AgentDropDown";
import { MetaTags } from "react-meta-tags";
function ClientsList(props) {
  const [addModal, setAddReminderToClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState({});
  const [assignedClients, setAssignedClients] = useState([]);
  
  const columns = [
    {
      dataField: "checkbox",
      text: <input type="checkbox" id="select-all-clients" onChange={(e)=>{
        checkAllBoxes("select-all-clients", ".client-checkbox");
        setAssignedClients(()=>{
          if (e.target.checked){
            return [...props.clients];
          }
          else if (!e.target.checked){
            return [];
          }
        });
      }} />,
      formatter:(val)=> <input type="checkbox" onChange = {(e)=>setAssignedClients(preValue=>{

        if (e.target.checked){
          return [val, ...preValue];
        }
        else if (!e.target.checked){
          return preValue.filter(client=>client._id !== val._id);
        }
        
      })} className ="client-checkbox" />,
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => (val ? new Date(val.createdAt).toLocaleDateString() : "-")
    },
    {
      dataField: "title",
      text: props.t("Title"),
      format: (val) => (val ? val : "-")
    },
    {
      dataField: "name",
      text: props.t("Name"),
      formatter: (client) => (
        <div>
          <Link 
            to={{
              pathname: "/clients/" + client.id + "/profile",
              state: { clientId: client.id }
            }}
          >
            <strong className="text-capitalize">{client.firstName + " " + client.lastName}</strong>
          </Link>
        </div>
      )
    },
    {
      dataField: "category",
      text:props.t("Type"),
      formatter: (val) => (val ? displaySubString(val.category) : "-"),

    },
    {
      dataField: "email",
      text:props.t("Email"),
      formatter : (val)=>(val ? captilazeFirstLetter(`${val.email}`) : "-")

    },
    {
      dataField: "phone",
      text: props.t("Phone"),
      format: (val) => (val || "-")
    },
    {
      dataField: "country",
      text: props.t("Country"),
      formatter: (val) => (val ? captilazeFirstLetter(`${val.country}`) : "-"),
    },

    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text:props.t("Agent"),
      formatter: (val) => (val.agent ? captilazeFirstLetter(`${val.agent.firstName} ${val.agent.lastName}`) : "Unassigned")
    },
    {
      dataField: "source",
      text:props.t("Source"),
      formatter :(val)=> (val.source === "REGISTER_DEMO" ? "Register Demo" : val.source)
    },
    {
      dataField: "stages",
      text: props.t("KYC"),
      formatter: (val) => {
        if (val.stages) {
          const { kycApproved, kycRejected } = val.stages;
          if (kycApproved) {
            return (<div className="">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-check-circle font-size-20"
                  id="approve-icon"
              
                ></i>
              </Link>
            </div>);
          }
          if (kycRejected) {
            return (
              <div className="">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-close-thick font-size-20"
                    id="reject-icon"
                
                  ></i>
                </Link>
              </div>);
            
          }
          else {
            return (<div className="">
              <Link className="text-warning" to="#">
                <i
                  className="mdi mdi-alert-decagram-outline font-size-20"
                  id="pending-icon"
                
                ></i>
              </Link>
            </div>);
          }
        }
        else {
          return "Pending";
        }
      }
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (user) => (
        <div className="">
          <Link className="text-success" to="#">
            <i
              className="mdi mdi-calendar-text font-size-20"
              id="edittooltip"
              onClick={() => { setSelectedClient(user); setAddReminderToClientModal(true) }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];

  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchInputText, setSearchInputText] = useState("");
  const handleSearchInput = (e) => (setSearchInputText(e.target.value));
  const dispatch = useDispatch();

  useEffect(() => {
    loadClients(1, sizePerPage);
  }, [sizePerPage, 1, searchInputText]);
  
  const loadClients = (page, limit) => {
    if (searchInputText !== "" && searchInputText.length >= 3) {
      dispatch(fetchClientsStart({
        limit,
        page,
        searchText: searchInputText
      }));
    }
    else if (searchInputText === "") {
      dispatch(fetchClientsStart({
        limit,
        page
      }));
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Clients
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          {/* <h2>{props.t("Clients")}</h2> */}
          <TodoAdd
            show={addModal} 
            selectedClient={selectedClient} 
            onClose={() => { setAddReminderToClientModal(false) }}
            hidenAddButton={true}
          />
          <h2>{props.t("Clients List")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <CardTitle>{props.t("Client List")} ({props.totalDocs})</CardTitle>
                    <ClientAdd />
                  </div>

                  <div className="d-flex justify-content-between">
                    <SearchBar handleSearchInput={handleSearchInput} />
                    {assignedClients.length > 0 &&  <AgentForm clients= {[...assignedClients]} />}
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-hover table-clients"
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}>{column.text}</Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody className="text-center" style={{ fontSize: "13px" }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.clients.map((row, rowIndex) =>
                            <Tr key={rowIndex} >
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                 
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={loadClients}
                        docs={props.clients}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </div>
      </div>
    </React.Fragment>
  );

}

const mapStateToProps = (state) => ({
  loading: state.clientReducer.loading || false,
  clients: state.clientReducer.clients || [],
  page: state.clientReducer.page || 1,
  totalDocs: state.clientReducer.totalDocs || 0,
  totalPages: state.clientReducer.totalPages || 0,
  hasNextPage: state.clientReducer.hasNextPage,
  hasPrevPage: state.clientReducer.hasPrevPage,
  limit: state.clientReducer.limit,
  nextPage: state.clientReducer.nextPage,
  pagingCounter: state.clientReducer.pagingCounter,
  prevPage: state.clientReducer.prevPage,
  clientPermissions: state.Profile.clientPermissions || {},
  docs:state.usersReducer.docs || []
});
export default connect(mapStateToProps, null)(withTranslation()(ClientsList));
