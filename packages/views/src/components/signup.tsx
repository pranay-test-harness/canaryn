import { SpotlightsBG, Text } from '@harnessio/canary'
import React from 'react'

export default function Signup() {
  return (
    <SpotlightsBG.Root>
      <SpotlightsBG.Content>
        <Text size={6} weight="medium" align="center" color="primary">
          Sign up
        </Text>
      </SpotlightsBG.Content>
    </SpotlightsBG.Root>
  )
}