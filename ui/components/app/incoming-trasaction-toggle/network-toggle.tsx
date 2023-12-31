import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ETHERSCAN_SUPPORTED_NETWORKS } from '../../../../shared/constants/network';
import { I18nContext } from '../../../contexts/i18n';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  Display,
  FlexDirection,
  JustifyContent,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import {
  AvatarNetwork,
  AvatarNetworkSize,
  Box,
  Text,
} from '../../component-library';
import ToggleButton from '../../ui/toggle-button';
import Tooltip from '../../ui/tooltip';

const MAXIMUM_CHARACTERS_WITHOUT_TOOLTIP = 20;

interface NetworkPreferences {
  isShowIncomingTransactions: boolean;
  label: string;
  imageUrl: string;
}

interface NetworkToggleProps {
  networkPreferences: NetworkPreferences;
  toggleSingleNetwork: (chainId: string, value: boolean) => void;
  chainId: string;
}

const NetworkToggle = ({
  networkPreferences,
  toggleSingleNetwork,
  chainId,
}: NetworkToggleProps) => {
  const t = useContext(I18nContext);

  const { isShowIncomingTransactions } = networkPreferences;

  const networkName = networkPreferences.label;

  type SupportedChainId = keyof typeof ETHERSCAN_SUPPORTED_NETWORKS;

  const networkDomainAndSubdomain =
    ETHERSCAN_SUPPORTED_NETWORKS?.[chainId as SupportedChainId];

  const domain = networkDomainAndSubdomain?.domain;

  const upperCaseDomain = domain?.charAt(0)?.toUpperCase() + domain?.slice(1);

  return (
    <Box
      marginTop={6}
      marginBottom={6}
      display={Display.Flex}
      flexDirection={FlexDirection.Row}
      justifyContent={JustifyContent.spaceBetween}
      data-testid={`network-toggle-${chainId}`}
      className="network-toggle-wrapper"
    >
      <Box
        gap={2}
        backgroundColor={BackgroundColor.transparent}
        display={Display.Flex}
        alignItems={AlignItems.center}
        width={BlockSize.Full}
      >
        <AvatarNetwork
          size={AvatarNetworkSize.Sm}
          src={networkPreferences.imageUrl}
          name={networkName}
        />
        <Box display={Display.Flex} flexDirection={FlexDirection.Column}>
          <Text
            color={TextColor.textDefault}
            backgroundColor={BackgroundColor.transparent}
            variant={TextVariant.bodyMd}
            ellipsis
            marginLeft={2}
          >
            {networkName.length > MAXIMUM_CHARACTERS_WITHOUT_TOOLTIP ? (
              <Tooltip title={networkName} position="bottom">
                {networkName}
              </Tooltip>
            ) : (
              networkName
            )}
          </Text>
          <Text
            color={TextColor.primaryDefault}
            backgroundColor={BackgroundColor.transparent}
            variant={TextVariant.bodySm}
            ellipsis
            marginLeft={2}
          >
            {
              // For tests, we have localhost in the network list, but obviously
              // there's no 3rd party API for incoming transactions for such
              // Chain ID (0x539). We don't show any link, then.
              domain && (
                <a
                  key={`network_${domain}_link`}
                  href={`https://${domain}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {upperCaseDomain}
                </a>
              )
            }
          </Text>
        </Box>
      </Box>

      <ToggleButton
        value={isShowIncomingTransactions}
        onToggle={(value) => toggleSingleNetwork(chainId, !value)}
        offLabel={t('off')}
        onLabel={t('on')}
      />
    </Box>
  );
};

export default NetworkToggle;

NetworkToggle.propTypes = {
  chainId: PropTypes.string.isRequired,
  networkPreferences: PropTypes.object.isRequired,
  toggleSingleNetwork: PropTypes.func.isRequired,
};
