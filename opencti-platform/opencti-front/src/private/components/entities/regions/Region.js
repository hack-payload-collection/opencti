import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import inject18n from '../../../../components/i18n';
import RegionOverview from './RegionOverview';
import RegionEdition from './RegionEdition';
import RegionPopover from './RegionPopover';
import EntityLastReports from '../../analysis/reports/StixCoreObjectOrStixCoreRelationshipLastReports';
import EntityCampaignsChart from '../../threats/campaigns/EntityCampaignsChart';
import EntityReportsChart from '../../analysis/reports/StixCoreObjectReportsChart';
import EntityXOpenCTIIncidentsChart from '../../events/x_opencti_incidents/EntityXOpenCTIIncidentsChart';
import StixDomainObjectHeader from '../../common/stix_domain_objects/StixDomainObjectHeader';
import Security, { KNOWLEDGE_KNUPDATE } from '../../../../utils/Security';
import StixCoreObjectNotes from '../../analysis/notes/StixCoreObjectOrStixCoreRelationshipNotes';
import RegionParentRegions from './RegionParentRegions';
import RegionSubRegions from './RegionSubRegions';

const styles = () => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
});

class RegionComponent extends Component {
  render() {
    const { classes, region } = this.props;
    return (
      <div className={classes.container}>
        <StixDomainObjectHeader
          stixDomainObject={region}
          PopoverComponent={<RegionPopover />}
        />
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
        >
          <Grid item={true} xs={3}>
            <RegionOverview region={region} />
          </Grid>
          <Grid item={true} xs={3}>
            {region.isSubRegion ? (
              <RegionParentRegions region={region} />
            ) : (
              <RegionSubRegions region={region} />
            )}
          </Grid>
          <Grid item={true} xs={6}>
            <EntityLastReports entityId={region.id} />
          </Grid>
        </Grid>
        <StixCoreObjectNotes stixCoreObjectId={region.id} />
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
          style={{ marginTop: 15 }}
        >
          <Grid item={true} xs={4}>
            <EntityCampaignsChart entityId={region.id} inferred={true} />
          </Grid>
          <Grid item={true} xs={4}>
            <EntityXOpenCTIIncidentsChart
              entityId={region.id}
              inferred={true}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <EntityReportsChart entityId={region.id} />
          </Grid>
        </Grid>
        <Security needs={[KNOWLEDGE_KNUPDATE]}>
          <RegionEdition regionId={region.id} />
        </Security>
      </div>
    );
  }
}

RegionComponent.propTypes = {
  region: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const Region = createFragmentContainer(RegionComponent, {
  region: graphql`
    fragment Region_region on Region {
      id
      isSubRegion
      subRegions {
        edges {
          node {
            id
          }
        }
      }
      name
      x_opencti_aliases
      ...RegionOverview_region
      ...RegionSubRegions_region
      ...RegionParentRegions_region
    }
  `,
});

export default compose(inject18n, withStyles(styles))(Region);
