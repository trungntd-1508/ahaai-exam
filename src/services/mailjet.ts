import Mailjet from 'node-mailjet';
import Settings from '@configs/settings';
import { getConsoleLogger } from '@libs/consoleLogger';

class MailjetService {
  static readonly MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC;

  static readonly MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE;

  public static async send(recipients: { email: string, name: string }[], templateName: string, variables: any, attachments: { contentType: string, fileName: string, base64Content: string }[]) {
    const mailjet = new Mailjet({ apiKey: this.MJ_APIKEY_PUBLIC, apiSecret: this.MJ_APIKEY_PRIVATE });
    const request = mailjet
      .post('send', { 'version': 'v3.1' })
      .request({
        'Messages': [
          {
            'To': recipients.map((recipient) => {
              return { Email: recipient.email, Name: recipient.name };
            }),
            'TemplateID': (Settings.mailjetTemplateMapping as any)[templateName],
            'TemplateLanguage': true,
            'Variables': variables,
            'Attachments': attachments
              ? attachments.map((attachment) => {
                return { ContentType: attachment.contentType, Filename: attachment.fileName, Base64Content: attachment.base64Content };
              })
              : undefined,
          },
        ],
      });
    request
      .then((result: any) => {
        const successLogger = getConsoleLogger('inboundLogging');
        successLogger.addContext('requestType', 'MailjetLogging');
        successLogger.info(JSON.stringify(result.body));
      })
      .catch((error: any) => {
        const errorLogger = getConsoleLogger('errorLogging');
        errorLogger.addContext('requestType', 'MailjetLogging');
        errorLogger.error(error);
      });
  }
}

export default MailjetService;
