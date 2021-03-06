import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import inject18n from '../../../../components/i18n';
import StixCoreObjectHistoryLines, {
  stixCoreObjectHistoryLinesQuery,
} from './StixCoreObjectHistoryLines';
import { QueryRenderer } from '../../../../relay/environment';

class StixCoreObjectLatestHistory extends Component {
  render() {
    const { t, stixCoreObjectStandardId } = this.props;
    return (
      <div style={{ height: '100%' }} className="break">
        <Typography variant="h4" gutterBottom={true}>
          {t('Most recent history')}
        </Typography>
        <QueryRenderer
          query={stixCoreObjectHistoryLinesQuery}
          variables={{
            filters: [
              { key: 'entity_id', values: [stixCoreObjectStandardId] },
              {
                key: 'event_type',
                values: ['create', 'update', 'update_add', 'update_remove'],
              },
            ],
            first: 5,
            orderBy: 'event_date',
            orderMode: 'desc',
          }}
          render={({ props }) => {
            if (props) {
              return (
                <StixCoreObjectHistoryLines
                  stixCoreObjectStandardId={stixCoreObjectStandardId}
                  data={props}
                  isRelationLog={false}
                />
              );
            }
            return <div />;
          }}
        />
      </div>
    );
  }
}

StixCoreObjectLatestHistory.propTypes = {
  t: PropTypes.func,
  stixCoreObjectStandardId: PropTypes.string,
};

export default inject18n(StixCoreObjectLatestHistory);
