import { FloatingAlert } from './FloatingAlert'

export function FloatingAlertExample() {
  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <FloatingAlert state="danger" size="md" onDismiss={() => console.log('dismissed')}>
        Something went wrong. Please try again.
      </FloatingAlert>

      <FloatingAlert state="warning" size="md" onDismiss={() => console.log('dismissed')}>
        Your session is about to expire.
      </FloatingAlert>

      <FloatingAlert state="information" size="md" onDismiss={() => console.log('dismissed')}>
        A new version is available.
      </FloatingAlert>

      <FloatingAlert state="success" size="md" onDismiss={() => console.log('dismissed')}>
        Changes saved successfully.
      </FloatingAlert>
    </div>
  )
}
