import { TooltipProvider, Tooltip } from './Tooltip'

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip content="Tooltip label" arrowOrientation="bottom-left">
        <button type="button">Hover me</button>
      </Tooltip>
    </TooltipProvider>
  )
}
