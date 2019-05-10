/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import { Button, Card, Form, Grid, Icon, Dropdown, Label, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import InputField from './commons/InputField';
import useFormFields from './hooks/useFormFields';

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

const renderDetails = (details, removeDetail, handleDetailChange) => {
  return (
    <Grid stackable padded>
      {details.map((detail, idx) => (
        <Grid.Row key={`${detail.description}`}>
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
              name="amount"
              label="Amount"
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
  );
};

const renderUI = (
  details,
  addDetail,
  removeDetail,
  handleDetailChange,
  company,
  handleCompanyName,
  companyModalStatus,
  toggleCompanyModal
) => {
  const trigger = <Icon onClick={toggleCompanyModal} style={{ cursor: 'pointer' }} name="edit" />;
  return (
    <Form size="massive">
      <CompanyDropdownStyle>
        <Form.Field>
          <label htmlFor="invoice-gen-form-dropdown">Company</label>
          <Dropdown
            selection
            search
            allowAdditions
            clearable
            id="invoice-gen-form-dropdown"
            options={[{ text: 'Text', value: 'value', key: 'key' }]}
          />
        </Form.Field>
        <Modal
          closeIcon
          open={companyModalStatus}
          onClose={toggleCompanyModal}
          trigger={trigger}
          style={{ fontSize: 'inherit' }}
        >
          <Modal.Header>
            <h2>Company: {company.name}</h2>
          </Modal.Header>
          <Modal.Content>
            <Form style={{ fontSize: 'inherit' }}>
              <InputField name="name" label="Name" id="invoice-gen-company-name" disabled />
              <InputField name="VAT" label="VAT" id="invoice-gen-company-vat-name" disabled />
              <InputField id="invoice-gen-company-address-street" label="Street" name="street" />
              <InputField id="invoice-gen-company-address-city" label="City" name="city" />
              <InputField
                id="invoice-gen-company-address-zipCode"
                label="Zip Code"
                name="zipCode"
                type="number"
              />
              <InputField id="invoice-gen-company-address-country" label="Country" name="country" />
              <Button primary style={{ fontSize: 'inherit' }} onClick={toggleCompanyModal}>
                Edit
              </Button>
            </Form>
          </Modal.Content>
        </Modal>
      </CompanyDropdownStyle>
      <div style={{ fontWeight: 'bold' }}>
        Details <Icon onClick={addDetail} style={{ cursor: 'pointer' }} name="add circle" />
      </div>
      <hr />
      {renderDetails(details, removeDetail, handleDetailChange)}
      <InputField label="VAT" />
      <Button primary size="massive">
        Generate
      </Button>
    </Form>
  );
};

const InvoiceCreationForm = () => {
  const [details, setDetail] = useState([{}]);
  const [companyModalStatus, setCompanyModalStatus] = useState(false);
  const company = useFormFields({});

  const addDetail = () => {
    setDetail([...details, {}]);
  };

  const toggleCompanyModal = () => {
    setCompanyModalStatus(!companyModalStatus);
  };

  const removeDetail = idx => {
    const copyDetails = [...details];
    copyDetails.splice(idx, 1);
    setDetail(copyDetails);
  };

  const handleCompanyName = (e, { value }) => {
    company.onChange({ target: { name: 'name', value } });
  };

  const handleDetailChange = (e, idx) => {
    const copyDetails = [...details];
    copyDetails[idx] = { ...copyDetails[idx], [e.target.name]: e.target.value };
    setDetail(copyDetails);
  };

  return (
    <Card fluid raised>
      <Card.Content>
        <h2>Generate an invoice</h2>
      </Card.Content>
      <Card.Content>
        {renderUI(
          details,
          addDetail,
          removeDetail,
          handleDetailChange,
          company,
          handleCompanyName,
          companyModalStatus,
          toggleCompanyModal
        )}
      </Card.Content>
    </Card>
  );
};

export default InvoiceCreationForm;
