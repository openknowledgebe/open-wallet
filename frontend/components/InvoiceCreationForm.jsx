/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form, Grid, Icon, Dropdown, Label, Modal, Popup } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import InputField from './commons/InputField';
import useFormInput from './hooks/useFormInput';
import { QUERY_COMPANIES } from '../graphql/queries';
import { companyType } from '../types';

const CompanyDropdownStyle = styled.div`
  display: flex;
  justify-content: space-between;
  div:first-child {
    width: 100%;
    padding-right: 5px;
  }
  i {
    align-self: center;
  }
`;

const Details = ({ details: { details, setDetail } }) => {
  const addDetail = () => {
    setDetail([...details, { id: details.length }]);
  };

  const removeDetail = idx => {
    const copyDetails = [...details];
    copyDetails.splice(idx, 1);
    setDetail(copyDetails);
  };

  const handleDetailChange = (e, idx) => {
    const copyDetails = [...details];
    copyDetails[idx] = { ...copyDetails[idx], [e.target.name]: e.target.value };
    setDetail(copyDetails);
  };
  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>
        Details <Icon onClick={addDetail} style={{ cursor: 'pointer' }} name="add circle" />
      </div>
      <hr />
      <Grid stackable padded>
        {details.map((detail, idx) => (
          <Grid.Row key={detail.id}>
            <Grid.Column width={11}>
              <InputField
                id={`invoice-gen-form-description-${idx}`}
                onChange={e => handleDetailChange(e, idx)}
                value={detail.description}
                name="description"
                label="Description"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <InputField
                id={`invoice-gen-form-amount-${idx}`}
                onChange={e => handleDetailChange(e, idx)}
                value={detail.amount}
                placeholder="Excluding VAT"
                name="amount"
                label="Amount (€)"
                type="number"
              />
            </Grid.Column>
            <Grid.Column width={1} style={{}}>
              <Icon
                onClick={() => removeDetail(idx)}
                style={{ cursor: 'pointer' }}
                name="minus circle"
              />
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    </div>
  );
};

Details.propTypes = {
  details: PropTypes.shape({
    details: PropTypes.arrayOf(
      PropTypes.shape({
        id: Number,
        description: String,
        Amount: Number
      })
    ),
    setDetail: PropTypes.func
  }).isRequired
};

const Company = ({ companies, selectedCompany: { selectedCompany, setSelectedCompany } }) => {
  const [$companies, setCompanies] = useState(companies || []);
  const [companyModalStatus, setCompanyModalStatus] = useState(false);

  const toggleCompanyModal = () => {
    if (companyModalStatus) {
      const copyCompanies = [...$companies];
      const idx = $companies.findIndex(company => company.name === selectedCompany.name);
      copyCompanies[idx] = selectedCompany;
      setCompanies(copyCompanies);
    } else if (!selectedCompany.name) return;
    setCompanyModalStatus(!companyModalStatus);
  };

  const formattedCompanies = $companies.map(company => ({
    value: company.name,
    text: company.name,
    key: company.name,
    selected: company.name === selectedCompany.name
  }));

  const addCompany = (e, { value }) => {
    setCompanies([...$companies, { name: value }]);
  };

  const handleCompanyName = (e, { value }) => {
    const company = $companies.find(c => value === c.name);
    if (company) {
      setSelectedCompany({ ...company, ...company.address });
    } else {
      setSelectedCompany({ name: value });
    }
  };

  const handleCompanyFieldsChange = e => {
    const { name, value } = e.target;
    setSelectedCompany({ ...selectedCompany, [name]: value });
  };

  const trigger = <Icon onClick={toggleCompanyModal} style={{ cursor: 'pointer' }} name="edit" />;

  return (
    <CompanyDropdownStyle>
      <Form.Field>
        <label htmlFor="invoice-gen-form-dropdown">Company</label>
        <Dropdown
          placeholder="Choose or add a name"
          selection
          search
          allowAdditions
          clearable
          id="invoice-gen-form-dropdown"
          options={formattedCompanies}
          defaultValue={selectedCompany.name}
          onAddItem={addCompany}
          onChange={handleCompanyName}
        />
      </Form.Field>
      <Popup
        style={{ fontSize: 'inherit', color: 'red' }}
        trigger={trigger}
        disabled={companyModalStatus}
        on="click"
        content="Please first select or add a name"
        position="bottom right"
      />
      <Modal
        closeIcon
        open={companyModalStatus}
        onClose={toggleCompanyModal}
        style={{ fontSize: 'inherit' }}
      >
        <Modal.Header>
          <h2>Edit the company&apos;s data</h2>
        </Modal.Header>
        <Modal.Content>
          <Form as="div" style={{ fontSize: 'inherit' }}>
            <InputField
              name="name"
              placeholder="Please provide the company's full name since it will appear in official documents"
              label="Name"
              id="invoice-gen-company-name"
              value={selectedCompany.name}
              onChange={handleCompanyFieldsChange}
              disabled={!!selectedCompany.name}
            />
            <InputField
              name="VAT"
              label="VAT"
              value={selectedCompany.VAT}
              onChange={handleCompanyFieldsChange}
              id="invoice-gen-company-vat-name"
              disabled={!!selectedCompany.VAT}
            />
            <InputField
              id="invoice-gen-company-address-street"
              value={selectedCompany.street}
              onChange={handleCompanyFieldsChange}
              label="Street"
              name="street"
            />
            <InputField
              id="invoice-gen-company-address-city"
              value={selectedCompany.city}
              onChange={handleCompanyFieldsChange}
              label="City"
              name="city"
            />
            <InputField
              value={selectedCompany.zipCode}
              onChange={handleCompanyFieldsChange}
              id="invoice-gen-company-address-zipCode"
              label="Zip Code"
              name="zipCode"
              type="number"
            />
            <InputField
              id="invoice-gen-company-address-country"
              label="Country"
              name="country"
              value={selectedCompany.country}
              onChange={handleCompanyFieldsChange}
            />
            <Button
              type="button"
              primary
              style={{ fontSize: 'inherit' }}
              onClick={toggleCompanyModal}
            >
              Edit
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </CompanyDropdownStyle>
  );
};

Company.defaultProps = {
  companies: []
};

Company.propTypes = {
  companies: PropTypes.arrayOf(companyType),
  selectedCompany: PropTypes.shape({
    selectedCompany: companyType,
    setSelectedCompany: PropTypes.func
  }).isRequired
};

const renderUI = (details, companies, selectedCompany, vat, handleSubmit) => {
  return (
    <Form size="massive" onSubmit={handleSubmit}>
      <Company selectedCompany={selectedCompany} companies={companies} />
      <Details details={details} />
      <InputField label="VAT (%)" name="VAT" id="invoice-gen-form-vat" {...vat} />
      <Button primary size="massive">
        Generate
      </Button>
    </Form>
  );
};

const FormManager = ({ data }) => {
  const [details, setDetail] = useState([{ id: 0 }]);
  const [selectedCompany, setSelectedCompany] = useState({});
  const vat = useFormInput(21);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(selectedCompany);
    console.log(details);
  };

  return (
    <Card fluid raised>
      <Card.Content>
        <h2>Generate an invoice</h2>
      </Card.Content>
      <Card.Content>
        {renderUI(
          { details, setDetail },
          data.companies,
          {
            selectedCompany,
            setSelectedCompany
          },
          vat,
          handleSubmit
        )}
      </Card.Content>
    </Card>
  );
};

const Main = () => {
  return <Query query={QUERY_COMPANIES}>{({ data }) => <FormManager data={data} />}</Query>;
};

export default Main;
