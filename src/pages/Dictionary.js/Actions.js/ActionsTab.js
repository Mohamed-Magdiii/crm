import React from "react";
import { connect } from "react-redux";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader 
} from "reactstrap";
import { Link } from "react-router-dom";
import ActionsAdd from "./ActionsAdd";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import Notification from "components/Common/Notification";
function ActionsTab(props){
  
  const columns = [
    {
      dataField:"action",
      text:"Action", 
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (item) => (
        <div className="d-flex gap-3">
          <Link className="text-success" to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {}}
            ></i>
          </Link>
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => {}}
            ></i>
          </Link>
        </div>
      ),
    },
    
  ];
  const customData = props.dictionary[0] ? props.actions.map(action=>{
    return {
      id:Math.random(),
      action:action 
    };
  }) : [] ; 
  console.log(props.actions);
  return (
    <React.Fragment>
      <div className="container-fluid">
  
        <Row>
          <Col>
            <Card>
              <CardHeader className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between  align-items-center">
                  <CardTitle>Actions</CardTitle>
                  <ActionsAdd />
                </div>
              </CardHeader>
              <CardBody>

                <div className="table-responsive">
                  <BootstrapTable
                    keyField="id"
                    data={customData}
                    columns={columns}
                    cellEdit={cellEditFactory({ 
                      mode: "click", 
                      
                    }
                    )}
                    
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  actions :state.dictionaryReducer.actions || [],
  id :state.dictionaryReducer.id
});
export default connect(mapStateToProps, null)(ActionsTab);