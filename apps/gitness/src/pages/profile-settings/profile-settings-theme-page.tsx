import { Spacer, Text, ThemeSelector } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

import { useTheme } from '../../framework/context/ThemeContext'

const ProfileSettingsThemePage: React.FC = () => {
  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight="medium">
          Theme Selector
        </Text>
        <Spacer size={6} />
        <ThemeSelector useTheme={useTheme} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ProfileSettingsThemePage }
