export const generateApplicationAcceptedHTML = (
  firstName = '',
  jobTitle = '',
  companyName = '',
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Wazfnee - Application Accepted</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f5f7;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background-color: #f4f5f7; padding: 40px 0;"
        >
          <tr>
            <td align="center">

              <table
                role="presentation"
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 600px;
                  width: 100%;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #16a34a;
                      padding: 30px;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                      "
                    >
                      Wazfnee
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 40px;
                    "
                  >
                    <h2
                      style="
                        margin: 0 0 20px;
                        color: #1f2937;
                        font-size: 24px;
                      "
                    >
                      Congratulations!
                    </h2>

                    <p
                      style="
                        margin: 0 0 10px;
                        color: #4b5563;
                        font-size: 16px;
                      "
                    >
                      Hello <strong>${firstName}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 20px;
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      We are pleased to inform you that your application
                      for the position of
                      <strong>${jobTitle}</strong>
                      at
                      <strong>${companyName}</strong>
                      has been accepted.
                    </p>

                    <div
                      style="
                        display: inline-block;
                        padding: 18px 30px;
                        margin: 10px 0 25px;
                        background-color: #f0fdf4;
                        border: 2px solid #16a34a;
                        border-radius: 10px;
                      "
                    >
                      <span
                        style="
                          color: #16a34a;
                          font-size: 20px;
                          font-weight: bold;
                        "
                      >
                        Application Accepted
                      </span>
                    </div>

                    <p
                      style="
                        margin: 0;
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      The hiring team will contact you with the next steps.
                      Please keep an eye on your email for further updates.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 20px 40px;
                      background-color: #f9fafb;
                      border-top: 1px solid #e5e7eb;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 13px;
                      "
                    >
                      &copy; ${new Date().getFullYear()} Wazfnee.
                      All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
