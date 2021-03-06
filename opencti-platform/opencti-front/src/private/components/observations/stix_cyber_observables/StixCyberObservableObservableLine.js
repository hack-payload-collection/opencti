import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { Link } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Help, MoreVert } from '@material-ui/icons';
import inject18n from '../../../../components/i18n';
import StixCyberObservableRelationPopover from '../../common/stix_cyber_observable_relationships/StixCyberObservableRelationshipPopover';
import { resolveLink } from '../../../../utils/Entity';
import ItemIcon from '../../../../components/ItemIcon';

const styles = (theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
  },
  itemIcon: {
    color: theme.palette.primary.main,
  },
  bodyItem: {
    height: 20,
    fontSize: 13,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  goIcon: {
    position: 'absolute',
    right: -10,
  },
  itemIconDisabled: {
    color: theme.palette.grey[700],
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: theme.palette.grey[700],
  },
});

class StixCyberObservableObservableLineComponent extends Component {
  render() {
    const {
      nsd,
      t,
      classes,
      dataColumns,
      node,
      paginationOptions,
      displayRelation,
      entityId,
    } = this.props;
    const element = node.from.id === entityId ? node.to : node.from;
    const link = `${resolveLink(element.entity_type)}/${element.id}`;
    return (
      <ListItem
        classes={{ root: classes.item }}
        divider={true}
        button={true}
        component={Link}
        to={link}
      >
        <ListItemIcon classes={{ root: classes.itemIcon }}>
          <ItemIcon type={element.entity_type} />
        </ListItemIcon>
        <ListItemText
          primary={
            <div>
              {displayRelation ? (
                <div
                  className={classes.bodyItem}
                  style={{ width: dataColumns.relationship_type.width }}
                >
                  {node.relationship_type}
                </div>
              ) : (
                ''
              )}
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.entity_type.width }}
              >
                {t(`entity_${element.entity_type}`)}
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.observable_value.width }}
              >
                {element.observable_value}
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.start_time.width }}
              >
                {node.inferred ? '-' : nsd(node.start_time)}
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.stop_time.width }}
              >
                {node.inferred ? '-' : nsd(node.stop_time)}
              </div>
            </div>
          }
        />
        <ListItemSecondaryAction>
          <StixCyberObservableRelationPopover
            stixCyberObservableRelationId={node.id}
            paginationOptions={paginationOptions}
            disabled={node.inferred}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

StixCyberObservableObservableLineComponent.propTypes = {
  entityId: PropTypes.string,
  paginationOptions: PropTypes.object,
  dataColumns: PropTypes.object,
  node: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  nsd: PropTypes.func,
  displayRelation: PropTypes.bool,
};

const StixCyberObservableObservableLineFragment = createFragmentContainer(
  StixCyberObservableObservableLineComponent,
  {
    node: graphql`
      fragment StixCyberObservableObservableLine_node on StixCyberObservableRelationship {
        id
        relationship_type
        start_time
        stop_time
        from {
          ... on StixCyberObservable {
            id
            entity_type
            observable_value
            created_at
            updated_at
          }
        }
        to {
          ... on StixCyberObservable {
            id
            entity_type
            observable_value
            created_at
            updated_at
          }
        }
      }
    `,
  },
);

export const StixCyberObservableObservableLine = compose(
  inject18n,
  withStyles(styles),
)(StixCyberObservableObservableLineFragment);

class StixCyberObservableObservableLineDummyComponent extends Component {
  render() {
    const { classes, dataColumns, displayRelation } = this.props;
    return (
      <ListItem classes={{ root: classes.item }} divider={true}>
        <ListItemIcon classes={{ root: classes.itemIconDisabled }}>
          <Help />
        </ListItemIcon>
        <ListItemText
          primary={
            <div>
              {displayRelation ? (
                <div
                  className={classes.bodyItem}
                  style={{ width: dataColumns.relationship_type.width }}
                >
                  <div className="fakeItem" style={{ width: '80%' }} />
                </div>
              ) : (
                ''
              )}
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.entity_type.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.observable_value.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.start_time.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.stop_time.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
            </div>
          }
        />
        <ListItemSecondaryAction classes={{ root: classes.itemIconDisabled }}>
          <MoreVert />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

StixCyberObservableObservableLineDummyComponent.propTypes = {
  dataColumns: PropTypes.object,
  classes: PropTypes.object,
  displayRelation: PropTypes.bool,
};

export const StixCyberObservableObservableLineDummy = compose(
  inject18n,
  withStyles(styles),
)(StixCyberObservableObservableLineDummyComponent);
