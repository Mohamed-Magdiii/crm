import { useEffect,useState } from 'react'
import React from 'react'
import { fetchLeads ,fetchLeadsSuccess} from '../../store/leads/actions'
import {useDispatch,useSelector} from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, CardHeader } from "reactstrap"

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './lead.page.custom.styles.scss'

import "./datatables.scss"
function LeadsList(){
  const columns = [{
    dataField: 'createdAt',
    text: 'Register Date',
    
  }, 
  {dataField:'name',
  text:'Name'
},
  {
    dataField: 'email',
    text: 'Email',
    
  }, {
    dataField: 'phone',
    text: 'Phone',
    
  }, {
    dataField: 'language',
    text: 'Language',
    
  }, {
    dataField: 'callStatus',
    text: 'Call Status',
    
  }, {
    dataField: 'country',
    text: 'Country',
  
  }, 
  {dataField:'agent',text:'Sales Agent'},
  {
    dataField:'source',
    text:'Source'
  }];
 
    
    const {leads}=useSelector(state=>state.leadReducer)
    const [sizePerPage,setSizePerPage]=useState(10)
    const customizedLeads=leads.map(lead=>{
      const date=new Date(lead.createdAt)
  
      return {...lead,name:`${lead.firstName} ${lead.lastName}`, createdAt:date.toLocaleDateString(),agent:lead.agent?lead.agent._id:'-'}
    })
    
    const dispatch=useDispatch()
    const pageOptions = {
      sizePerPage: sizePerPage,
      totalSize: leads.length,
      custom: true,
    }
  
    const selectRow = {
      mode: 'checkbox'
    }
    const { SearchBar } = Search;
    useEffect(()=>{
         
        fetch('http://localhost:3001/api/v1/crm/leads')
        .then(result=>result.json())
        .then(data=>{
            dispatch(fetchLeads(data.result.docs))
            dispatch(fetchLeadsSuccess(false))
        }).catch(error=>{
              dispatch(error)
        })
    },[])
   return(
    <React.Fragment>
    <div className="page-content">
      
      <div className="container-fluid">
        <h2>Leads</h2>

        <Row>
          <Col className="col-12">
            <Card>
              <CardHeader className="d-flex justify-content-between  align-items-center">
                 <CardTitle>Leads List({leads.length})</CardTitle>
                  <button className="add-btn">Add+</button>
              </CardHeader>
              <CardBody>
                

                <PaginationProvider
                  pagination={paginationFactory(pageOptions)}
                  keyField='id'
                  columns={columns}
                  data={customizedLeads}
                >
                  {({ paginationProps, paginationTableProps }) => (
                    <ToolkitProvider
                      keyField='id'
                      columns={columns}
                      data={customizedLeads}
                      search
                    >
                      {toolkitProps => (
                        <React.Fragment>

                          <Row className="mb-2">
                            <Col md="4">
                              <div className="search-box me-2 mb-2 d-inline-block">
                                <div className="position-relative">
                                  <SearchBar
                                    {...toolkitProps.searchProps}
                                  />
                                  <i className="bx bx-search-alt search-icon" />
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col xl="12">
                              <div className="table-responsive">
                                <BootstrapTable
                                  keyField={"id"}
                                  responsive
                                  bordered={false}
                                  striped={false}
                                  selectRow={selectRow}
                                  classes={
                                    "table align-middle table-nowrap"
                                  }
                                  headerWrapperClasses={"thead-light"}
                                  {...toolkitProps.baseProps}
                                  {...paginationTableProps}
                                />

                              </div>
                            </Col>
                          </Row>

                          <Row className="align-items-md-center mt-30">
                           <div className="p-2 border">
                            <Col className="pagination pagination-rounded gap-4 d-flex align-items-md-center" >
                            <div className='custom-div'>
                            <PaginationListStandalone 
                              {...paginationProps }
                              
                            />
                              </div>
                              <div>Records:{pageOptions.sizePerPage}</div>
                              <div >
                                <SizePerPageDropdownStandalone
                                  {...paginationProps}
                                  className="custom-background"
                                  onSizePerPageChange={(pageSize)=>setSizePerPage(pageSize)}
                                />
                              </div>
                              
                            </Col>
                            </div>
                          </Row>
                        </React.Fragment>
                      )
                      }
                    </ToolkitProvider>
                  )
                  }</PaginationProvider>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  </React.Fragment>
   )
}
export default LeadsList
