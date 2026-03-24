const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, bookingDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f0f4f0;font-family:Arial,sans-serif;">
      
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        
        <!-- HEADER -->
        <div style="background:linear-gradient(135deg,#1a6b3c,#2d9e5f);padding:40px 30px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:32px;letter-spacing:2px;">🏔️ Ghumfir</h1>
          <p style="color:#a8e6c1;margin:8px 0 0;font-size:14px;letter-spacing:1px;">TRAVEL & ADVENTURES</p>
        </div>

        <!-- STATUS BANNER -->
        <div style="background:${bookingDetails.status === 'approved' ? '#e8f5e9' : '#fff3e0'};padding:30px;text-align:center;border-bottom:3px solid ${bookingDetails.status === 'approved' ? '#2d9e5f' : '#ff9800'};">
          <div style="font-size:50px;margin-bottom:10px;">${bookingDetails.status === 'approved' ? '✅' : '⏳'}</div>
          <h2 style="color:${bookingDetails.status === 'approved' ? '#1a6b3c' : '#e65100'};margin:0;font-size:26px;">
            ${bookingDetails.status === 'approved' ? 'Booking Confirmed!' : 'Booking Received!'}
          </h2>
          <p style="color:#555;margin:8px 0 0;font-size:15px;">
            ${bookingDetails.status === 'approved' 
              ? `Thank you, ${bookingDetails.userName}. Your adventure is confirmed!` 
              : `Thank you, ${bookingDetails.userName}. Your adventure is being prepared.`}
          </p>
        </div>

        <!-- BOOKING ID -->
        <div style="padding:20px 30px;background:#f8f9fa;text-align:center;border-bottom:1px solid #e0e0e0;">
          <span style="font-size:12px;color:#888;letter-spacing:1px;">BOOKING ID</span>
          <p style="font-size:20px;font-weight:bold;color:#1a6b3c;margin:4px 0;letter-spacing:2px;">
            ${bookingDetails.bookingId.toString().toUpperCase().slice(-8)}
          </p>
          <span style="display:inline-block;background:${bookingDetails.status === 'approved' ? '#2d9e5f' : '#ff9800'};color:white;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:bold;">
            ${bookingDetails.status === 'approved' ? 'CONFIRMED' : 'PENDING CONFIRMATION'}
          </span>
        </div>

        <!-- PACKAGE DETAILS -->
        <div style="padding:30px;">
          <h3 style="color:#1a6b3c;margin:0 0 20px;font-size:18px;border-left:4px solid #2d9e5f;padding-left:12px;">
            Trip Details
          </h3>
          
          <div style="background:#f8faf8;border-radius:12px;overflow:hidden;border:1px solid #d4edda;">
            
            <!-- Package Name -->
            <div style="background:#1a6b3c;padding:16px 20px;">
              <p style="color:#a8e6c1;margin:0;font-size:11px;letter-spacing:1px;">PACKAGE</p>
              <p style="color:#ffffff;margin:4px 0 0;font-size:18px;font-weight:bold;">${bookingDetails.packageTitle}</p>
            </div>

            <!-- Details Grid -->
            <div style="display:grid;padding:0;">
              
              <div style="display:flex;border-bottom:1px solid #e8f5e9;">
                <div style="flex:1;padding:16px 20px;border-right:1px solid #e8f5e9;">
                  <p style="color:#888;margin:0;font-size:11px;letter-spacing:1px;">TOTAL PRICE</p>
                  <p style="color:#1a6b3c;margin:4px 0 0;font-size:20px;font-weight:bold;">NPR ${bookingDetails.totalPrice.toLocaleString()}</p>
                </div>
                <div style="flex:1;padding:16px 20px;">
                  <p style="color:#888;margin:0;font-size:11px;letter-spacing:1px;">SEATS BOOKED</p>
                  <p style="color:#333;margin:4px 0 0;font-size:18px;font-weight:bold;">${bookingDetails.seats} Person(s)</p>
                </div>
              </div>

              <div style="display:flex;border-bottom:1px solid #e8f5e9;">
                <div style="flex:1;padding:16px 20px;border-right:1px solid #e8f5e9;">
                  <p style="color:#888;margin:0;font-size:11px;letter-spacing:1px;">BOOKING DATE</p>
                  <p style="color:#333;margin:4px 0 0;font-size:15px;font-weight:bold;">${new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
                </div>
                <div style="flex:1;padding:16px 20px;">
                  <p style="color:#888;margin:0;font-size:11px;letter-spacing:1px;">PAYMENT</p>
                  <p style="color:#333;margin:4px 0 0;font-size:15px;font-weight:bold;">Cash on Arrival</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- WHAT HAPPENS NEXT -->
        <div style="padding:0 30px 30px;">
          <h3 style="color:#1a6b3c;margin:0 0 20px;font-size:18px;border-left:4px solid #2d9e5f;padding-left:12px;">
            What Happens Next?
          </h3>
          
          <div style="display:flex;flex-direction:column;gap:12px;">
            
            <div style="display:flex;align-items:flex-start;gap:16px;background:#f8faf8;padding:16px;border-radius:10px;border:1px solid #d4edda;">
              <div style="background:#1a6b3c;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;flex-shrink:0;text-align:center;line-height:32px;">1</div>
              <div>
                <p style="margin:0;font-weight:bold;color:#1a6b3c;font-size:14px;">Our team reviews your booking</p>
                <p style="margin:4px 0 0;color:#666;font-size:13px;">We will confirm your slot within 24 hours.</p>
              </div>
            </div>

            <div style="display:flex;align-items:flex-start;gap:16px;background:#f8faf8;padding:16px;border-radius:10px;border:1px solid #d4edda;">
              <div style="background:#1a6b3c;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;flex-shrink:0;text-align:center;line-height:32px;">2</div>
              <div>
                <p style="margin:0;font-weight:bold;color:#1a6b3c;font-size:14px;">Confirmation email sent</p>
                <p style="margin:4px 0 0;color:#666;font-size:13px;">You will receive a final confirmation with full trip details.</p>
              </div>
            </div>

            <div style="display:flex;align-items:flex-start;gap:16px;background:#f8faf8;padding:16px;border-radius:10px;border:1px solid #d4edda;">
              <div style="background:#1a6b3c;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;flex-shrink:0;text-align:center;line-height:32px;">3</div>
              <div>
                <p style="margin:0;font-weight:bold;color:#1a6b3c;font-size:14px;">Pack your bags!</p>
                <p style="margin:4px 0 0;color:#666;font-size:13px;">Get ready for an unforgettable journey with Ghumfir.</p>
              </div>
            </div>

          </div>
        </div>

        <!-- FOOTER -->
        <div style="background:#1a1a2e;padding:24px 30px;text-align:center;">
          <p style="color:#a8e6c1;margin:0;font-size:16px;font-weight:bold;">🏔️ Ghumfir Travel</p>
          <p style="color:#888;margin:8px 0 4px;font-size:12px;">Thamel, Kathmandu, Nepal</p>
          <p style="color:#888;margin:0;font-size:12px;">Questions? Email us at 
            <a href="mailto:ghumfirsupport@gmail.com" style="color:#2d9e5f;">ghumfirsupport@gmail.com</a>
          </p>
          <p style="color:#555;margin:12px 0 0;font-size:11px;">© 2026 Ghumfir Travel. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"Ghumfir Travel" <${process.env.EMAIL}>`,
      to,
      subject,
      html: htmlTemplate
    });

    console.log('Email sent to', to);
  } catch (err) {
    console.log('Email error:', err.message);
  }
};

module.exports = sendEmail;