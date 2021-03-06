import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import inject18n from '../../../../components/i18n';
import EntityStixCoreRelationshipsDonut from '../../common/stix_core_relationships/EntityStixCoreRelationshipsDonut';

const styles = () => ({
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: '15px',
    borderRadius: 6,
  },
});

class ObservedDataDetailsComponent extends Component {
  render() {
    const {
      t, fldt, classes, observedData,
    } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {t('Entity details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <Grid container={true} spacing={3}>
            <Grid item={true} xs={6}>
              <Typography variant="h3" gutterBottom={true}>
                {t('First observed')}
              </Typography>
              {fldt(observedData.first_observed)}
              <Typography
                variant="h3"
                gutterBottom={true}
                style={{ marginTop: 20 }}
              >
                {t('Number observed')}
              </Typography>
              {fldt(observedData.first_observed)}
            </Grid>
            <Grid item={true} xs={6}>
              <Typography variant="h3" gutterBottom={true}>
                {t('Last observed')}
              </Typography>
              {observedData.number_observed}
            </Grid>
          </Grid>
          <br />
          <EntityStixCoreRelationshipsDonut
            variant="inLine"
            entityId={observedData.id}
            entityType="Stix-Cyber-Observable"
            relationshipType="object"
            field="entity_type"
            height={260}
          />
        </Paper>
      </div>
    );
  }
}

ObservedDataDetailsComponent.propTypes = {
  observedData: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fldt: PropTypes.func,
  fld: PropTypes.func,
};

const ObservedDataDetails = createFragmentContainer(
  ObservedDataDetailsComponent,
  {
    observedData: graphql`
      fragment ObservedDataDetails_observedData on ObservedData {
        id
        first_observed
        last_observed
        number_observed
      }
    `,
  },
);

export default compose(inject18n, withStyles(styles))(ObservedDataDetails);
