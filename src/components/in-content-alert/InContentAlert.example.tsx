import { InContentAlert } from './InContentAlert'

export function InContentAlertExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InContentAlert
        content="info"
        size="lg"
        title="Your session will expire soon"
        body="Please save your work before the session ends in 5 minutes."
      />
      <InContentAlert
        content="success"
        size="md"
        title="Payment completed"
        body="Your transaction was processed successfully."
      />
      <InContentAlert
        content="danger"
        size="md"
        title="Action could not be completed"
        body="An error occurred. Please try again or contact support."
      />
      <InContentAlert
        content="warning"
        size="sm"
        title="Storage almost full"
      />
    </div>
  )
}
