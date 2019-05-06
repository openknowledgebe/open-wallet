const pdf = require('html-pdf');

const options = { format: 'Letter' };

const organization = {
  name: 'Open Knowledge Belgium vzw',
  address: {
    street: 'Cantersteen 12',
    city: 'Brussel',
    country: 'Belgium',
    zipCode: 1000
  },
  VAT: 'BE 0845.419.930',
  iban: 'BE45 0688 9551 0289'
};

const renderContactDetails = contact => {
  return `<strong>${contact.name}</strong><br />
  ${contact.address.street}<br />
  ${contact.address.zipCode} ${contact.address.city} ${contact.address.country} <br />VAT: ${
    contact.VAT
  }`;
};

const generateInvoice = /* sender */ (details, metadata, receiver) => {
  const total = details.reduce((acc, current) => acc + current.amount, 0);
  const amountVAT = (total / 100) * metadata.VAT;
  const totalInclVAT = total + amountVAT;
  const html = `<html>
      <head>
          <style>
            body {
              font-family: 'Poppins', Helvetica, sans-serif;
              font-size: 11px;
              margin: 1cm 1.5cm 0cm 1.5cm;
            }

            header {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-orient: horizontal;
              -webkit-box-direction: normal;
              -ms-flex-direction: row;
              flex-direction: row;
              -webkit-box-pack: justify;
              -ms-flex-pack: justify;
              justify-content: space-between;
            }

            .capitalize {
              text-transform: uppercase;
            }
            .interline {
              margin-bottom: 0.7cm
            }

            /* https://www.w3schools.com/css/tryit.asp?filename=trycss_table_padding */
            table, td, th {  
              border: 1px solid #ddd;
              text-align: left;
            }

            table {
              font-size: inherit;
              border-collapse: collapse;
            }

            th:last-child, td:last-child {
              text-align: right;
              width: 100%;
            }

            th:first-child, td:first-child {
              width: 80%;
            }

            th, td {
              padding: 10px 5px 10px 5px;
            }
            tfoot {
              font-weight: bold;
            }
            footer {
              text-align: center;
            }
          </style>
      </head>
      <body>
        <header id="pageHeader" >
            <div>${renderContactDetails(organization)}</div>
            <img width="100px" height="70px" src='https://pbs.twimg.com/profile_images/596612304248025088/NG6C1Wp6_400x400.png'/>
        </header>
        <main>
          <h1 class="capitalize interline">Invoice</h1>
          <div class="interline">${renderContactDetails(receiver)}</div>
          <div class="interline metadetails">
            <strong>Invoice: ${metadata.noInvoice}</strong><br />
            Date: ${new Date(metadata.date).toLocaleDateString('be-BE')}
          </div>
          <table class="interline">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${details
                .map(
                  detail => `<tr>
                <td>${detail.description}</td>
                <td>€ ${detail.amount}</td>
              </tr>`
                )
                .join('')}
            
            </tbody>
            <tfoot>
              <tr>
                <td>Total excl. VAT</td>
                <td>€ ${total}</td>
              </tr>
              <tr>
                <td>VAT ${metadata.VAT}%</td>
                <td>€ ${amountVAT}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>€ ${totalInclVAT}</td>
              </tr>
            </tfoot>
          </table>
          <div class="notice">Please pay this invoice by bank transfer, clearly stating the invoice number, to our account ${
            organization.iban
          } within 30 days after date of invoice clearly. 
          </div>
        </main>
        <footer id="pageFooter">${organization.name}</footer>
      </body>
    </html>`;
  return new Promise((resolve, reject) => {
    pdf.create(html, options).toFile('./businesscard.pdf', (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};

const receiver = {
  name: 'PwC Enterprise Advisory cvba,',
  address: {
    street: 'Woluwe Garden Woluwedal 18',
    city: 'Brussel',
    country: 'Sint-Stevens-Woluwe',
    zipCode: 1932
  },
  VAT: '0415.622.333'
};

const details = [
  {
    description: 'Purchase of the Gold Partner Package for the Open Belgium Conference 2019',
    amount: 3000
  },
  {
    description: 'Purchase of the Gold Partner Package for the Open Belgium Conference 2019',
    amount: 3000
  },
  {
    description: 'Purchase of the Gold Partner Package for the Open Belgium Conference 2019',
    amount: 3000
  }
];
const metadata = {
  VAT: 21,
  data: Date.now(),
  noInvoice: '2019/0005'
};

generateInvoice(details, metadata, receiver);
