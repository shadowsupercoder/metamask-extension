import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
///: BEGIN:ONLY_INCLUDE_IN(snaps)
import { SubjectType } from '@metamask/permission-controller';
///: END:ONLY_INCLUDE_IN
import PermissionsConnectHeader from '../../permissions-connect-header';
import Tooltip from '../../../ui/tooltip';
import PermissionsConnectPermissionList from '../../permissions-connect-permission-list';

export default class PermissionPageContainerContent extends PureComponent {
  static propTypes = {
    subjectMetadata: PropTypes.shape({
      name: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      subjectType: PropTypes.string.isRequired,
      extensionId: PropTypes.string,
      iconUrl: PropTypes.string,
    }),
    selectedPermissions: PropTypes.object.isRequired,
    selectedIdentities: PropTypes.array,
    allIdentitiesSelected: PropTypes.bool,
  };

  static defaultProps = {
    selectedIdentities: [],
    allIdentitiesSelected: false,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  renderRequestedPermissions() {
    const { selectedPermissions, subjectMetadata } = this.props;

    return (
      <div className="permission-approval-container__content__requested">
        <PermissionsConnectPermissionList
          permissions={selectedPermissions}
          targetSubjectMetadata={subjectMetadata}
        />
      </div>
    );
  }

  renderAccountTooltip(textContent) {
    const { selectedIdentities } = this.props;
    const { t } = this.context;

    return (
      <Tooltip
        key="all-account-connect-tooltip"
        position="bottom"
        wrapperClassName="permission-approval-container__bold-title-elements"
        html={
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {selectedIdentities.slice(0, 6).map((identity, index) => {
              return (
                <div key={`tooltip-identity-${index}`}>
                  {identity.addressLabel}
                </div>
              );
            })}
            {selectedIdentities.length > 6
              ? t('plusXMore', [selectedIdentities.length - 6])
              : null}
          </div>
        }
      >
        {textContent}
      </Tooltip>
    );
  }

  getTitle() {
    const {
      subjectMetadata,
      selectedIdentities,
      allIdentitiesSelected,
      selectedPermissions,
    } = this.props;
    const { t } = this.context;

    if (subjectMetadata.extensionId) {
      return t('externalExtension', [subjectMetadata.extensionId]);
    } else if (!selectedPermissions.eth_accounts) {
      return t('permissionRequestCapitalized');
    } else if (allIdentitiesSelected) {
      return t('connectToAll', [
        this.renderAccountTooltip(t('connectToAllAccounts')),
      ]);
    } else if (selectedIdentities.length > 1) {
      return t('connectToMultiple', [
        this.renderAccountTooltip(
          t('connectToMultipleNumberOfAccounts', [selectedIdentities.length]),
        ),
      ]);
    }
    return t('connectTo', [selectedIdentities[0]?.addressLabel]);
  }

  getHeaderText() {
    const { subjectMetadata } = this.props;
    const { t } = this.context;

    ///: BEGIN:ONLY_INCLUDE_IN(snaps)
    if (subjectMetadata.subjectType === SubjectType.Snap) {
      return t('allowThisSnapTo');
    }
    ///: END:ONLY_INCLUDE_IN

    return subjectMetadata.extensionId
      ? t('allowExternalExtensionTo', [subjectMetadata.extensionId])
      : t('allowThisSiteTo');
  }

  render() {
    const { subjectMetadata } = this.props;

    const title = this.getTitle();

    const headerText = this.getHeaderText();

    return (
      <div className="permission-approval-container__content">
        <div className="permission-approval-container__content-container">
          <PermissionsConnectHeader
            iconUrl={subjectMetadata.iconUrl}
            iconName={subjectMetadata.name}
            headerTitle={title}
            headerText={headerText}
            siteOrigin={subjectMetadata.origin}
            subjectType={subjectMetadata.subjectType}
          />
          <section className="permission-approval-container__permissions-container">
            {this.renderRequestedPermissions()}
          </section>
        </div>
      </div>
    );
  }
}
